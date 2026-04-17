"use strict";

var NMEAstreamDebug = require('debug')('tom1:NMEAstream');

var split = require('split'); //const serialPort = require('serialport') //werkt


var SerialPort = require('@serialport/stream'); //test op windows
//const Binding = require('@serialport/bindings')
//const readLine = require('@serialport/parser-readline') //werkt ook


var nmeaSim = require('./NMEAsimTom.js');

var nmeaPandaSim = require('./NMEApandaSimTom.js'); //const udpStream = require('./NMEAudpToStream.js')
//const GPSudpDatagram = require('./NMEAdatagram')


var _require = require('child_process'),
    exec = _require.exec;

var _require2 = require("child_process"),
    spawn = _require2.spawn;

var util = require("util");

var execProm = util.promisify(exec);

var net = require('net');

var client = new net.Socket();
var port;
var nmeaSimStream;
var nmeaPandaSimStream;

exports.getStream = function (choice) {
  switch (choice) {
    case "GPS":
      NMEAstreamDebug('get seriele poortstream');

      if (typeof port === 'undefined') {
        NMEAstreamDebug('port undefined, using serial0');
        port = new SerialPort('/dev/serial0', {
          baudRate: 115200
        });
      }

      return port;

    case "GPSudp":
      NMEAstreamDebug('Get udp-stream van TeensyGPS');

      if (typeof GPSudpStream === 'undefined') {//GPSudpStream = new udpStream()
        //GPSudp = GPSudpDatagram.init()
      }

      return GPSudp;

    case "GPS Simulatie":
      NMEAstreamDebug("get GPS simulatiestream");

      if (typeof nmeaSimStream === 'undefined') {
        nmeaSimStream = new nmeaSim(200);
      } else {
        NMEAstreamDebug('nmeaGPSSimStream niet gestart');
      }

      return nmeaSimStream;

    case "GPSudp Simulatie":
      NMEAstreamDebug("get udp simulatiestream");

      if (typeof nmeaPandaSimStream === 'undefined') {
        nmeaPandaSimStream = new nmeaPandaSim(400);
        NMEAstreamDebug('nmeaUdpSimStream gestart');
      } else {
        NMEAstreamDebug('nmeaUdpSimStream niet gestart');
      }

      return nmeaPandaSimStream;

    case "File":
      NMEAstreamDebug("get filestream");
      var os = new os_func();
      os.execCommand('pkill -9 str2str', function (returnvalue) {
        NMEAstreamDebug('pkill str2str: ' + returnvalue);
      });
      os.execCommand('../rtk/str2str -in ../rtk/LogThuis1.ntrip::T::x1::+330 -out tcpsvr://:52000', function (returnvalue) {});
      client.connect(52000, '127.0.0.1', function () {
        NMEAstreamDebug('nmea-client connected');
      });
      return client;

    default:
      return 'alert';
  }
};

function os_func() {
  this.execCommand = function (cmd, callback) {
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        NMEAstreamDebug('error str2str' + err);
        return;
      }

      callback(stdout);
    });
  };
}

;

function startNtrip() {
  NMEAstreamDebug('ntrip starten');

  var _require3 = require('child_process'),
      execFile = _require3.execFile;

  var child = execFile('./startFlepos.sh', [], function (error, stdout, stderr) {
    if (error) {
      throw error;
    }
  });
  NMEAstreamDebug(child.pid);
  return child.pid;
}

function run_shell_command(command) {
  var result;
  return regeneratorRuntime.async(function run_shell_command$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          NMEAstreamDebug('in run shell command : ' + command);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(execProm(command));

        case 4:
          result = _context.sent;
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          result = _context.t0;

        case 10:
          if (!Error[Symbol.hasInstance](result)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return");

        case 12:
          return _context.abrupt("return", result);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
}