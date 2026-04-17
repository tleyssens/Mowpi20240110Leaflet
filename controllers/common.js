//const SerialPort = require('serialport')
//const Readline = require('@serialport/parser-readline')

//own Modules
//const simu = require('./lib/sim/')
//const handleWeb = require('./lib/handleWeb')
//const handleGPIO = require('./lib/handleGPIO')
//const handleFile = require('./lib/handleFile')
//const handleGPS = require('./lib/handleGPS')//(io);
var Common = {
  /* EventEmitter: require('events'),
  SerialPort: require('serialport'),
  Readline: require('@serialport/parser-readline'),
  simu:   '',
  express: require('express'),
  http: require('http'),
  Sylvester: require('sylvester'),
  Kalman: require('kalman').KF,
  Motor: require('./lib/TomMotor.js'),
   */
  //handleWeb: require('./lib/handleWeb'),
  //handleGPIO: require('./lib/handleGPIO'),
  //handleFile: require('./lib/handleFile'),
  //handleGPS: require('./lib/handleGPS')
};
let s = require('../bin/settings.json')
// if (s.simulatie.type == 1) {
//   Common.simu = require('./sim1/')
// }
// if (s.simulatie.type == 2) {
//   Common.simu = require('./sim2/')
// }
//simu:   require('./lib/sim2/'),
module.exports = Common;