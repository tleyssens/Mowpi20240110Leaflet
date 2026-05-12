#!/usr/bin/env node
"use strict";

var config = require('./config');

var stateManager = config.stateManager;

var app = require('../app'); // <--- terug naar originele app.js


var http = require('http');

var server = http.createServer(app);

var _require = require("socket.io"),
    Server = _require.Server;

var io = new Server(server, {
  cors: {
    origin: "*"
  }
}); // SocketApi

var socketApiModule = require('../socketApi');

var socketApi = socketApiModule(stateManager, io);
stateManager.setIO(io);
console.log('StateManager en Socket.IO geïnitialiseerd');
var port = normalizePort(process.env.PORT || '3333');
app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = {
  io: io
};