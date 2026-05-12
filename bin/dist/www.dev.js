#!/usr/bin/env node
"use strict";

var config = require('./config');

var s = config.s; // oude compatibiliteit

var stateManager = config.stateManager;
var Mower = config.Mower;

var express = require('express');

var app = express(); // Socket.IO setup

var http = require('http');

var server = http.createServer(app);

var _require = require("socket.io"),
    Server = _require.Server;

var io = new Server(server, {
  cors: {
    origin: "*"
  }
}); // SocketApi initialisatie (aangepast voor StateManager)

var socketApiModule = require('../socketApi');

var socketApi = socketApiModule(stateManager, io); // <--- Belangrijkste lijn
// io doorgeven aan stateManager

stateManager.setIO(io);
console.log('StateManager en Socket.IO geïnitialiseerd');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3333');
app.set('port', port);
/**
 * Create HTTP server.
 */
//var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Create socket.io server
 */
//const socketApi = require('../socketApi')(stateManager);

var TomGuidance = require('../lib/TomGuidance');

var TomABLine = require('../lib/TomABLine');

var TomVehicle = require('../lib/TomVehicle');

var Guidance = new TomGuidance();
Guidance.Guidance(s.get ? s.get('mf') : s.mf);
s.gyd = Guidance;
var ABLine = new TomABLine();
ABLine.ABLine(s.get ? s.get('GUI.mf') : s.GUI.mf);
s.ABLine = ABLine;
TomVehicle.Vehicle(s.get ? s.get('GUI.mf') : s.GUI.mf); //var io = socketApi.io;

io.attach(server);
io.engine.on("connection_error", function (err) {
  console.log(err);
});
/**
 * Termination
 */

process.on('SIGINT', exit);
process.on('SIGTERM', exit);

function exit() {
  server.close(function () {
    console.log('Http-server terminated');
  });
  setTimeout(function () {
    if ((s.get ? s.get('GUI.NMEA.state') : s.GUI.NMEA.state) && (s.get ? s.get('GUI.NMEA.choice') : s.GUI.NMEA.choice) === "GPS") {
      nmeaFunc.stopStream1();
      console.log('str2str terminated');
    }

    console.log('bye');
    process.exit();
  }, 2000);
}
/**
 * Normalize a port into a number, string, or false.
 */


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

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
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port; //debug('Listening on ' + bind);
}