const express = require('express');
const addEventHandlers = require('./addEventHandlers');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const session = require('express-session');
const PORT = process.env.PORT || 1234;
const genID = require('./genID');

const app = express();
// app.use(require('cookie-parser')())
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false },
    name: 'token',
    genid: function(req) {
      return genID();
    }
  })
);

if (process.env.NODE_ENV !== 'production') {
  const Bundler = require('parcel-bundler');
  const bundler = new Bundler('app/index.html');
  app.use(bundler.middleware());
} else {
  app.use(express.static('dist'));
}

app.use(bodyParser.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

addEventHandlers(wss);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
