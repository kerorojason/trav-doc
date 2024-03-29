const express = require('express');
const addEventHandlers = require('./addEventHandlers');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const session = require('express-session');
const PORT = process.env.PORT || 1234;
const genID = require('./genID');

require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

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
const docSchema = new Schema({}, { strict: false });
mongoose.model('docs', docSchema);

app.use(bodyParser.json());
require('./routes/docRoute')(app);

if (process.env.NODE_ENV !== 'production') {
  const Bundler = require('parcel-bundler');
  const bundler = new Bundler('app/index.html');
  app.use(bundler.middleware());
} else {
  app.use(express.static('dist'));
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

addEventHandlers(wss);

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
