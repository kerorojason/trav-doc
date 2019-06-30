const WebSocket = require('ws');
const store = require('./store')();
const axios = require('axios');
const mongoose = require('mongoose');
const { convertToRaw } = require('draft-js');

module.exports = wss => {
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  const {
    setUser,
    deleteUser,
    getDelta,
    getState,
    updateUser,
    patchState,
    sendDoc,
    initialRawState,
    getTitle,
    setTitle,
    sendTitle,
    getPlaces,
    setPlaces,
    sendPlaces
  } = store;

  wss.on('connection', async function connection(ws, req) {
    const Doc = mongoose.model('docs');

    const token = req.headers.cookie && req.headers.cookie.split('=')[1];
    if (!token) return;
    setUser(token);
    ws.on('close', function close() {
      deleteUser(token);
    });

    // on first connection, get data from database
    const data = await Doc.findOne({
      docId: 2
    });
    console.log('Doc', data);

    const { doc, title, userAddPlaces } = data.toObject({ minimize: false });

    // let delta = getDelta(initialRawState, doc);
    console.log('doc', doc);

    let delta = getDelta(initialRawState, doc);
    setPlaces(userAddPlaces);
    setTitle(title);
    if (delta) {
      patchState(delta);
    }
    sendDoc({ delta, client: ws });
    sendTitle({ title, client: ws });
    sendPlaces({ userAddPlaces, client: ws });

    // let delta = getDelta(initialRawState, getState());
    // sendDoc({ delta, client: ws });
    // sendTitle({ getTitle, client: ws });
    // sendPlaces({ userAddPlaces: getPlaces(), client: ws });

    ws.on('message', function incoming(data) {
      data = JSON.parse(data);
      const { type } = data;
      switch (type) {
        case 'doc':
          let { raw, selection } = data;
          updateUser(token, { selection });
          console.log('raw', raw);
          let delta = getDelta(getState(), raw);
          if (delta) {
            patchState(delta);
          }
          wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              sendDoc({ client, delta });
            }
          });
          break;

        case 'title':
          let { title } = data;
          if (title !== getTitle()) {
            setTitle(title);
            wss.clients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                sendTitle({ client });
              }
            });
          }
          break;

        case 'places':
          let { userAddPlaces } = data;
          if (userAddPlaces.length !== getPlaces().length) {
            setPlaces(userAddPlaces);
            wss.clients.forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                sendPlaces({ client, userAddPlaces });
              }
            });
          }
          break;
      }
    });
  });
};
