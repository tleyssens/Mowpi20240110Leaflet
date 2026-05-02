"use strict";

module.exports = function (s) {
  //Tom: bijgezet
  var _require = require("./bin/config"),
      Mower = _require.Mower;

  var SocketApiDebug = require('debug')('tom:socketApi');

  var socket_io = require('socket.io');

  var io = socket_io();

  var fs = require('fs');

  var util = require('util');

  var readdir = util.promisify(fs.readdir);
  var fsPromises = fs.promises;

  var path = require('path');

  var directoryPath = path.join(__dirname, 'public/MissionPlan');
  var socketApi = {}; //const common = require('./controllers/common.js')

  var GPS = require('gps');

  socketApi.io = io;
  var mower = Mower;
  var sensoraanwezig = false; //let sim = new common.simu()
  //var nmeaSim = require('./controllers/NMEAsimTom.js')
  //var split = require('split')
  // test 20240227
  // const{SerialPort} = require('serialport');
  // var port = "COM3";
  // var message = "1";
  // SerialPort.list().then(ports => {
  //     ports.forEach(function(port) {
  //         SocketApiDebug(port.path)
  //     })
  // })
  // var serialPort = new SerialPort({path: '/dev/ttyS3', baudRate: 9600 });
  // serialPort.write(message, function(err) {
  //     if (err) {
  //         return console.log("Error on write: ", err.message);
  //     }
  //     console.log("Message sent successfully");
  // });

  var socketFunc = require('./controllers/socketFunc');

  var nmeaFunc = require('./controllers/nmeaFunc'); //let gpsFunc = require('./controllers/gpsFunc')
  //GYRO


  var i2c; //let i2c = require('i2c-bus')

  var MPU6050 = require('./lib/tom_i2c-mpu6050');

  var address = 0x68;
  var gyroRate = 0; //let i2c1 = i2c.openSync(1)

  if (sensoraanwezig) {
    var _sensor = new MPU6050(i2c1, address);

    _sensor.reset(address);

    SocketApiDebug(_sensor.readSync());

    var _offset = -2.4216;

    setInterval(getAngle, 100);
  } //let n = 1
  //let som = 0
  //let gem = 0


  var angle = 0;

  function getAngle() {
    data = sensor.readSync(); //som += data.gyro.x
    //gem = som / n

    gyroRate = data.gyro.x - offset;
    angle += gyroRate / 100; //n += 1
    //SocketApiDebug("sensorRaw = %s ; angle = %s", data.gyro.x, angle)

    s.GUI.angleIMU = angle;
    io.sockets.emit('s', s.GU);
  }

  io.on('connection', function (socket) {
    SocketApiDebug(' *** A user connected:  Mes = %s, PID = %s', s.GUI.MaaiMES, process.pid);
    socket.emit('state', s.GUI); //deel toestand knoppen met nieuwe client

    socket.on('KnopMes', function () {
      //Mesknop bedient in client
      SocketApiDebug('Mesknop bedient in client');
      s.GUI.MaaiMES = s.GUI.MaaiMES ? false : true; //sync clients (knop aanpassen)

      mower.setMes(s.GUI.MaaiMES);
      io.sockets.emit('state', s.GUI); //Deel toestand knop met alle clients
    });
    socket.on('KnopReset', function () {
      s.GUI.Autosteer = false;
      nmeaFunc.Reset();
      io.sockets.emit('state', s.GUI);
      io.sockets.emit('RemoveMarkers');
    });
    socket.on('KnopTest', function () {
      s.GUI.SlowTest = s.GUI.SlowTest ? false : true;
      SocketApiDebug('KnopTest = ' + s.GUI.SlowTest);
      nmeaFunc.slowStream(s.GUI.SlowTest);
      io.sockets.emit('state', s.GUI);
    });
    socket.on('KnopEncoderEnable', function () {
      nmeaFunc.enbleEncoder();
    });
    socket.on('KnopNMEA', function () {
      SocketApiDebug('85 NMEAknop bediend in client');
      s.GUI.INFO = "KnopNMEA gedrukt";
      s.GUI.NMEA.state = s.GUI.NMEA.state ? false : true;
      io.sockets.emit('state', s.GUI);

      if (s.GUI.NMEA.state) {
        nmeaFunc.startStream1(socket, s, io.sockets); //io.sockets meegeven om al de browservensters synchroon te houden
      } else {
        SocketApiDebug('stopping nmea stream');
        nmeaFunc.stopStream1();
      }
    });
    socket.on('NMEAsource', function (choice) {
      //Keuzemenu NMEA bron1
      SocketApiDebug('96 NMEAsource = ' + choice);
      s.GUI.INFO = "NMEAsource gekozen" + choice;
      s.GUI.NMEA.choice = choice; //GPS, GPSudp, Simulatie of file

      io.sockets.emit('state', s.GUI);

      if (s.GUI.NMEA.choice === "GPS Simulatie") {
        //simuleer 
        SocketApiDebug('nmeaFunc.KeyReceived = GPS simulatie');
        socket.on('key', nmeaFunc.KeyReceived); //Key received from client
      } else if (s.GUI.NMEA.choice === "GPS") {
        // stuur motoren aan
        SocketApiDebug('socketFunc.KeyReceived = motoren aansturen');
        socket.on('key', socketFunc.KeyReceived); //Key received from client
      } else if (s.GUI.NMEA.choice === "GPSudp Simulatie") {
        SocketApiDebug('nmeaFunc.KeyReceived = GPSudp simulatie');
        socket.on('key', nmeaFunc.KeyReceived); //Key received from client
      } else if (s.GUI.NMEA.choice === "GPSudp") {
        //stuur motoren aan
        SocketApiDebug('socketFunc.KeyReceived = motoren aansturen');
        socket.on('key', socketFunc.KeyReceived);
      }
    });
    socket.on('KnopMission', function () {
      s.GUI.contour.recList = s.mission.data.MissionPlan.MowArea.contour;
      SocketApiDebug('KnopMission gedrukt');
      s.GUI.mission.active = s.GUI.mission.active ? false : true;
      io.sockets.emit('state', s.GUI);
    });
    socket.on('KnopAutosteer', function () {
      SocketApiDebug('KnopAutosteer gedrukt');
      s.GUI.Autosteer = s.GUI.Autosteer ? false : true; //sync clients (knop aanpassen)

      io.sockets.emit('state', s.GUI);
    });
    socket.on('ContourChoice', function (choice) {
      s.GUI.contour.choice = choice;
      SocketApiDebug('Keuze =' + choice); //cc:Contour Opnemen#1; Knop gedrukt in client => s aanpassen + sync clients

      if (s.GUI.contour.choice == "Opnemen") {
        s.GUI.contour.isRecordOn = s.GUI.contour.isRecordOn ? false : true;
        s.GUI.contour.recordColor = s.GUI.contour.recordColor == "red" ? "" : "red"; //SocketApiDebug('kleur aanpassen')
      }

      if (s.GUI.contour.choice == "Openen") {
        // const directoryPath = path.join(__dirname, 'public/MissionPlan')
        SocketApiDebug(directoryPath);
        listDir(directoryPath).then(function (val) {
          s.GUI.contour.fileList = val;
          io.sockets.emit('state', s.GUI);
        });
      }

      if (s.GUI.contour.choice == "Tonen") {
        SocketApiDebug('tonen');
        s.GUI.contour.tonen = s.GUI.contour.tonen ? false : true;

        if (s.GUI.contour.tonen) {
          io.sockets.emit('traject', s.GUI.contour.recList);
        }
      }

      if (s.GUI.contour.choice == "Opslaan") {
        var _data = JSON.stringify(s.GUI.contour.recList);

        fs.writeFile('./public/MissionPlan/Recorded1.json', _data, function (err) {
          if (err) {
            throw err;
          }

          SocketApiDebug("JSON data is saved.");
        });
      }

      if (s.GUI.contour.choice == "Wissen") {
        s.GUI.contour.recList = []; //SocketApiDebug(JSON.stringify(s))
      }

      io.sockets.emit('state', s.GUI);
    });
    socket.on('missionBestand', function (naam) {
      // laad gekozen missiebestand
      fs.readFile(path.resolve(directoryPath, naam), 'utf-8', function (err, data) {
        if (err) {
          throw err;
        } // parse JSON object


        s.mission.data = JSON.parse(data.toString());
        s.GUI.contour.recList = s.mission.data.MissionPlan.MowArea.contour;
        SocketApiDebug(s.GUI.contour.recList); ////io.sockets.emit('jsonEditor', s.mission.data)
      });
    }); //cc:AutoMow#3;AutoMow ontvangen van server => s aanpassen + sync clients

    socket.on('AutoMow', function () {
      SocketApiDebug('AutoMowKnop bedient in client');
      s.autoMow2 = s.autoMow2 ? false : true; // rijden op gps alleen
      //s.autoMow3 = (s.autoMow3 ? false : true) // rijden op magneetsensor = wordt te fel gestoord door motoren 

      if (!s.autoMow2) {
        s.GUI.LM = 0;
        s.GUI.RM = 0;
      }

      io.sockets.emit('state', s.GUI);
    });
    socket.on('Knop', function (choice) {
      SocketApiDebug('KnopGedrukt' + choice);
    }); // aangepast op 2021 02 21
    // //cc:touchbesturing#3; sim.type = 3 is simulatie in UI, anders motoren aansturen
    // if (s.simulatie.type == 3) { //simuleer 
    //     socket.on('key', nmeaFunc.KeyReceived) //Key received from client
    // } else { // stuur motoren aan
    //     socket.on('key', socketFunc.KeyReceived); //Key received from client
    // }

    socket.on('DriveEnable', function () {
      s.GUI.driveEnable = s.GUI.driveEnable ? false : true;
      SocketApiDebug('DriveEnable = ' + s.GUI.driveEnable);
      io.sockets.emit('state', s.GUI);
    });
    socket.on('FixedRoute', function () {
      SocketApiDebug('FixedRoute emit ontvangen');
    });
    socket.on("*", function (event, data) {
      SocketApiDebug(event);
      SocketApiDebug(data);
    });
  });
  io.on('disconnect', function (reason) {
    SocketApiDebug("reason: ".concat(reason));
  });

  socketApi.sendNotification = function () {
    io.sockets.emit('hello', {
      msg: 'Hello World!'
    });
  };

  function listDir(path) {
    var names1;
    return regeneratorRuntime.async(function listDir$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            try {
              names1 = fsPromises.readdir(path); //io.sockets.emit('state', s.GUI)
            } catch (err) {
              console.error('Error occured while reading directory!', err);
            }

            SocketApiDebug(names1);
            return _context.abrupt("return", names1);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  } //module.exports = socketApi;


  return socketApi; //Tom: bijgezet (anders cannot find attach)
}; //Tom: bijgezet