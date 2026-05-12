"use strict";

// socketApi.js - StateManager versie (volledig werkend)
module.exports = function (stateManager, io) {
  // Backward compatibility
  var s = stateManager; // io opslaan voor oude code

  this.io = io;

  var _require = require("./bin/config"),
      Mower = _require.Mower;

  var SocketApiDebug = require('debug')('tom:socketApi');

  var fs = require('fs');

  var util = require('util');

  var fsPromises = fs.promises;

  var path = require('path');

  var directoryPath = path.join(__dirname, 'public/MissionPlan');
  var socketApi = {};
  var mower = Mower;

  var socketFunc = require('./controllers/socketFunc');

  var nmeaFunc = require('./controllers/nmeaFunc');

  var MPU6050 = require('./lib/tom_i2c-mpu6050');

  var sensoraanwezig = false;
  var angle = 0;
  io.on('connection', function (socket) {
    SocketApiDebug(' *** A user connected: Mes = %s', s.get('GUI.MaaiMES'));
    socket.emit('state', s.get('GUI'));
    socket.on('KnopMes', function () {
      SocketApiDebug('Mesknop bedient in client');
      var current = s.get('GUI.MaaiMES');
      s.set('GUI.MaaiMES', !current);
      mower.setMes(s.get('GUI.MaaiMES'));
      io.sockets.emit('state', s.get('GUI'));
    });
    socket.on('KnopReset', function () {
      s.set('GUI.Autosteer', false);
      nmeaFunc.Reset();
      io.sockets.emit('state', s.get('GUI'));
      io.sockets.emit('RemoveMarkers');
    });
    socket.on('KnopTest', function () {
      var current = s.get('GUI.SlowTest');
      s.set('GUI.SlowTest', !current);
      nmeaFunc.slowStream(s.get('GUI.SlowTest'));
      io.sockets.emit('state', s.get('GUI'));
    });
    socket.on('KnopNMEA', function () {
      var current = s.get('GUI.NMEA.state');
      s.set('GUI.NMEA.state', !current);
      io.sockets.emit('state', s.get('GUI'));

      if (s.get('GUI.NMEA.state')) {
        nmeaFunc.startStream1(socket, s, io.sockets);
      } else {
        nmeaFunc.stopStream1();
      }
    });
    socket.on('NMEAsource', function (choice) {
      SocketApiDebug('NMEAsource gekozen: ' + choice);
      s.set('GUI.NMEA.choice', choice);
      io.sockets.emit('state', s.get('GUI'));

      if (choice === "GPS Simulatie" || choice === "GPSudp Simulatie") {
        socket.on('key', nmeaFunc.KeyReceived);
      } else if (choice === "GPS" || choice === "GPSudp") {
        socket.on('key', socketFunc.KeyReceived);
      }
    });
    socket.on('KnopMission', function () {
      s.set('GUI.mission.active', !s.get('GUI.mission.active'));
      io.sockets.emit('state', s.get('GUI'));
    });
    socket.on('KnopAutosteer', function () {
      var current = s.get('GUI.Autosteer');
      s.set('GUI.Autosteer', !current);
      io.sockets.emit('state', s.get('GUI'));
    });
    socket.on('DriveEnable', function () {
      var current = s.get('GUI.driveEnable');
      s.set('GUI.driveEnable', !current);
      io.sockets.emit('state', s.get('GUI'));
    }); // Voeg hier later meer events toe indien nodig

    socket.on("*", function (event, data) {
      SocketApiDebug('Event: ' + event);
    });
  }); // Extra functies

  socketApi.sendNotification = function () {
    io.sockets.emit('hello', {
      msg: 'Hello World!'
    });
  };

  return socketApi;
};