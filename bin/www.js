#!/usr/bin/env node

/**
 * Load shared settings-data 
 */
var s = require('./settings.json')
//if (s.plaats === "pa") { s.contour.recList = s.contour.recListPa}
//if (s.plaats === "tom") { s.contour.recList = s.contour.recListTom}
let nmeaFunc = require('../controllers/nmeaFunc')

/**
 * Module dependencies.
 */
var app = require('../app');
var debug = require('debug')('tom1:http');
const util = require('util');

var http = require('http');
const {
  monitorEventLoopDelay
} = require('perf_hooks');
var mower
//var mower = require('../lib/Mower')

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3333');
app.set('port', port);
//debug('port set %o', port)
/**
 * Connect settings to app
 */
//app.set('s',s)
//var q = app.get('s') //werkt hier wel maar niet in map.js
//console.log(q)
//console.log(app.settings.s)

/**
 * Create HTTP server.
 */
//cc:1_OpstartenServer#1;createserver
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Create socket.io server (Tom: bijgezet)
 * wat heb ik geleerd: 
 *      # dit geeft een module terug io = require( "socket.io" )
 *      # dit geeft een object terug io = require( "socket.io" )()
 *   te testen met console.log(Object.getOwnPropertyNames(io))
 * https://stackoverflow.com/questions/24609991/using-socket-io-in-express-4-and-express-generators-bin-www
 */
var socketApi = require('../socketApi')(s);
let TomGuidance = require('../lib/TomGuidance')
let TomABLine = require('../lib/TomABLine')
let TomVehicle = require('../lib/TomVehicle')

let Guidance = new TomGuidance()
//s.gyd = new TomGuidance()
Guidance.Guidance(s.mf)
s.gyd = Guidance
let ABLine = new TomABLine()
//s.ABLine = TomABLine
//ABLine = new s.ABLine
ABLine.ABLine(s.GUI.mf)
//ABLine.ABLine(s.mf)
s.ABLine = ABLine // in GUI nodig of niet?
debug(util.inspect(TomABLine, true, 10, true))
//let Vehicle = TomVehicle()
TomVehicle.Vehicle(s.GUI.mf)
console.log(TomVehicle)
// s.Vehicle = Vehicle

var io = socketApi.io;
//console.log(Object.getOwnPropertyNames(io))
io.attach(server); // Tom: bijgezet
  io.engine.on("connection_error", (err) => { //20220627
   console.log(err);
  });
//let localisation = require('../lib/')

/**
 * Termination
 */
process.on('SIGINT', exit);
process.on('SIGTERM', exit);

/**
 * Terminate flepos-stream
 */
function exit() {
  server.close(() => {
    console.log('Http-server terminated')
  })
  setTimeout(function () {
    if (s.GUI.NMEA.state && s.GUI.NMEA.choice === "GPS") {
      nmeaFunc.stopStream1()
      console.log('str2str terminated')
    }
    //mower.cleanup()
    console.log('bye')
    process.exit()
  }, 2000)
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
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

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}