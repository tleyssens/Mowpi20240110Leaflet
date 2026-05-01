"use strict"; // gebruikt in simulatie

var _require = require('../bin/www'),
    constants = _require.constants,
    Mower = _require.Mower,
    s = _require.s;

var debugNmeaFunc = require("debug")("tom1:NmeaFunc");

var dgram = require("dgram");

var vec2 = require("../lib/vec");

var _require2 = require("../lib/vec3"),
    vec3 = _require2.vec3;

var vecFix2Fix = require("../lib/vec3").vecFix2Fix; //var s = require("../bin/settings.json"); //laad json-data uit bestand


var autosteer = require("./autosteer");

s.GUI.mf.guidanceLookPos = new vec2(0, 0);
s.GUI.mf.fixHeading = 0.0;
s.GUI.mf.guidanceLineSteerAngle = 90;
s.GUI.mf.avgSpeed = 0; // gps gebruikt ? let pn = require('../bin/position.json') //position?
//let TomGuidance = require("../lib/TomGuidance")

var mower = Mower; //var nmeaSim = require('./NMEAsimTom.js')

var NMEAstream = require("./NMEAstream.js"); // Teleplot


var teleplot = dgram.createSocket('udp4');
var msg;
var lastData = "",
    lastTime = "";
var prevQuality = '';

var _require3 = require("child_process"),
    execFile = _require3.execFile; //const { isNullOrUndefined } = require('util');


var split = require("split");

var PIDcontroller = require("node-pid-controller"),
    GPS = require("../lib/TomGPS"),
    gps = new GPS();

gps.state.bearing = 0;
gps.prevSpeedFix = new vec2(0, 0);
gps.avgSpeed = 0;
gps.speed = 0;
gps.previousSpeed = 0;
gps.startSpeed = 0.5;
s.ctr = new PIDcontroller({
  k_p: s.pid.kp,
  k_i: s.pid.ki,
  k_d: s.pid.kd,
  //dt: 1,
  i_max: s.pid.imax,
  target: s.pid.target
});

var Sylvester = require("sylvester"),
    Kalman = require("kalman").KF;

var A = Sylvester.Matrix.I(2);
var B = Sylvester.Matrix.Zero(2, 2);
var H = Sylvester.Matrix.I(2);
var C = Sylvester.Matrix.I(2);
var Q = Sylvester.Matrix.I(2).multiply(1e-5); //hoger getal => smoother en trager was 1e-5

var R = Sylvester.Matrix.I(2).multiply(0.000002); //kleiner => sneller     0.000001
//startpunt

var u = $V([s.start1.lat, s.start1.lng]); //moeten de 2 waarden niet omgewisseld ? zie regel 163 / tom is start1

var filter = new Kalman(u, //  $V([0, 0]),
$M([[1, 0], [0, 1]]));
var prev = {
  lat: null,
  lon: null
};
var parser;
var nmeaStream;
var stream;

var pathPlan = require("./pathPlanning");

var recordPath = require("./recordPath"); //var mission = require("./mission");//voor 19/10/2022


var mission = require("./mission20221019"); // vanaf 19/10/2022


var noRTKteller = 0;
var startCounter = 0,
    speedCounter = 0,
    gpsHz = s.gpsHz;
var isFirstFixPositionSet = false,
    isGPSPositionInitialized = false,
    isFirstHeadingSet = false,
    isJobStarted = false,
    prevFix = new vec2(0, 0),
    guidanceLookAheadTime = 1,
    lastGPS = new vec2(0, 0),
    currentStepFix = 0,
    totalFixSteps = 20,
    stepFixPts = new vecFix2Fix(totalFixSteps),
    distanceCurrentStepFix = 0,
    gpsHeading = 10.0,
    minFixStepDist = 1,
    isSuperSlow = false,
    dist = 0,
    pivotAxlePos = new vec3(0, 0, 0),
    steerAxlePos = new vec3(0, 0, 0),
    AutosteerVorige = false;

exports.KeyReceived = function (data) {
  //simulatie 
  switch (data.Key) {
    case "Steering":
      var X = parseFloat(data.steer);
      var Y = parseFloat(data.speed);
      debugNmeaFunc("101 steerangle in key %s", map_range(X, -250, 250, -90, 90));
      nmeaStream.nmea.steerangle = map_range(X, -250, 250, -90, 90);
      nmeaStream.nmea.stepDistance = map_range(Y, -250, 250, -0.2, 0.2);
      break;

    case "clickTarget":
      if (!s.pos) s.pos = {};
      s.pos.target = {
        lat: data.value.lat,
        lon: data.value.lng
      }; //traject.push(data.value.latLng);
      //io.emit('log', 'punt toegevoegd aan traject: ' + JSON.stringify(traject, null, 4));

      break;

    case "Pvalue":
      debugNmeaFunc("112 Pvalue = " + JSON.stringify(data, null, 4));
      s.ctr.k_p = data.value;
      break;

    case "Ivalue":
      debugNmeaFunc("ctr = " + JSON.stringify(s.ctr, null, 4));
      debugNmeaFunc("117 Ivalue = " + JSON.stringify(data, null, 4));
      s.ctr.k_i = data.value;
      break;

    case "Dvalue":
      debugNmeaFunc("121 Dvalue = " + JSON.stringify(data, null, 4));
      s.ctr.k_d = data.value;
      break;

    case "pureValue":
      debugNmeaFunc("125 pureValue = " + JSON.stringify(data, null, 4));
      s.ABLine.mf.vehicle.goalPointLookAhead = data.value;
      break;
  }
};

exports.startStream1 = function (socket, s, socketList) {
  //debugNmeaFunc("this = %o", this)
  if (s.GUI.NMEA.choice === "GPS") {
    debugNmeaFunc("- ntrip van flepos naar GPS opstarten");
    runShellScript("/home/pi/MowPi100/startFlepos.sh"); //runShellScript('/home/pi/MowPi100/startNtripPa.sh')
    //runShellScript('/home/pi/MowPi100/startNtripTom.sh')

    nmeaStream = NMEAstream.getStream(s.GUI.NMEA.choice); //debugNmeaFunc('in startStream1')

    debugNmeaFunc(Object.getOwnPropertyNames(nmeaStream));
    stream = nmeaStream.pipe(split("\r\n")); // debugNmeaFunc('parser :', parser)
    // if (parser = 'alert') {
    //   socket.emit('alert', 'Maak eerst een keuze in de dropdown')
    // } else {

    stream.on('data', function (line) {
      return debugNmeaFunc("".concat(line));
    });
    startParsing(stream, s, socketList); //}
  }

  if (s.GUI.NMEA.choice === "GPSudp") {
    debugNmeaFunc("151 ntrip van flepos naar TeensyGPS opstarten (via udp) => todo getRTCMstream.js opstarten via programma. voorlopig opstarten op Pi4B");
    s.UDP.port = s.UDP.gpsPort;
    var udpClientGPS = dgram.createSocket("udp4"); //getRTCMstream nog op te starten

    debugNmeaFunc(Object.getOwnPropertyNames(socketList));
    startParsingUDP(udpClientGPS, s, socketList);
  }

  if (s.GUI.NMEA.choice === "GPS Simulatie") {
    debugNmeaFunc("160 startStream1 GPS Simulatie"); // zorgt voor de wijzerplaat
    //gps.state.speed = 0.2;

    nmeaStream = NMEAstream.getStream(s.GUI.NMEA.choice); //debugNmeaFunc(Object.getOwnPropertyNames(nmeaStream)) //OK

    stream = nmeaStream.pipe(split("\r\n")); // debugNmeaFunc('parser :', parser)
    // if (parser = 'alert') {
    //   socket.emit('alert', 'Maak eerst een keuze in de dropdown')
    // } else {

    startParsing(stream, s, socketList); //}
  }

  if (s.GUI.NMEA.choice === "GPSudp Simulatie") {
    var udpSender = dgram.createSocket('udp4');
    s.UDP.port = s.UDP.simPort;
    nmeaStream = NMEAstream.getStream(s.GUI.NMEA.choice);
    stream = nmeaStream.pipe(split("\r\n"));
    stream.on('data', function (data) {
      udpSender.send(data, 0, data.length, s.UDP.port, '127.0.0.1');
    });
    debugNmeaFunc("182 startUdpPandaSimStream");

    var _udpClientGPS = dgram.createSocket("udp4"); // zorgt voor de wijzerplaat


    gps.state.speed = 0.2;
    startParsingUDP(_udpClientGPS, s, socketList); //}
  }
};

exports.stopStream1 = function () {
  debugNmeaFunc("185 stopStream1");

  if (s.GUI.NMEA.choice === "GPS") {
    mower.stop();
    runShellScript("/home/pi/MowPi100/stopFlepos.sh");
  }

  if (s.GUI.NMEA.choice === "GPSudp") {
    mower.stop();
    return;
  } //stream.pause();


  nmeaStream.pause();
};

exports.Reset = function () {
  debugNmeaFunc("198 Reset gedrukt"); //s.mf.isAutoSteerBtnOn = false

  nmeaStream.nmea.latitude = s.start1.lat;
  nmeaStream.nmea.longitude = s.start1.lng;
  nmeaStream.nmea.headingTrue = s.start1.richting * Math.PI / 180; //nmeaStream.nmea.time = 100

  nmeaStream.resume(); //s.pos.target = s.start1
  //s.pos.temp = s.start1
  //s.pos.target.lon = s.start1.lon

  isFirstFixPositionSet = false;
  debugNmeaFunc(s);
};

exports.enableEncoder = function () {};

exports.slowStream = function (state) {
  debugNmeaFunc('streamtijd ', nmeaStream.time);
  nmeaStream.time = state ? 5000 : 200;
};

function startParsing(stream, s, socketList) {
  debugNmeaFunc("218 startParsing"); //if(stream.paused) stream.resume()

  stream.on("data", function (data) {
    //ontvangt data van simulatie regel per regel
    //var d = new Date();
    //debugNmeaFunc(d.getTime())
    //debugNmeaFunc('streamData', data)
    //socket.emit('nmea', data )// data.quality + " " + data.satellites + " " + data.hdop);//komt op ui/map
    !isGPSPositionInitialized ? debugNmeaFunc("238 ".concat(data)) : null; //regel alleen eerste 10 keer laten zien

    try {
      gps.update(data); //stuur een regel door naar gps
    } catch (e) {
      //debugNmeaFunc(`gps not updated => ${e.name}: ${e.message}`);
      if (s.debugGPS) {
        debugNmeaFunc("gps not updated => ".concat(e.name, ": ").concat(e.message));
        return;
      }
    }
  });
  gps.on("data", function (data) {
    //debugNmeaFunc('242 gpsdata %o', data)
    if (gps.state.speed > 0 && gps.state.speed < 10) {
      //socket.emit('gpsState', gps.state);//data voor wijzerplaat en grafiek in mapsxx.html
      s.GUI.gps = gps;
    }
  });
  gps.on("GGA", function (data) {
    //data bevat de huidige positie
    //var t0 = performance.now();
    var verschil = Date.now() - data.time; //socketList.emit('log','verschil' + verschil)

    if (data.quality != prevQuality) {
      console.log('quality = ' + data.quality);
      socketList.emit("quality", data.quality + " " + data.satellites + " " + data.hdop);
      prevQuality = data.quality;
    }

    if (s.GUI.NMEA.choice === "GPS" && (verschil > 100 || verschil < -5)) return;
    s.GUI.data = data;

    if (data.valid === false || data.lat === null || data.lon === null || gps.state.speed > 10 || data.lat < -90 || data.lat > 90 || data.lon < -180 || data.lon > 180) {
      //mower.stop()
      socketList.emit('log', 'invalid data in nmeaFunc 277');
      gps.state.speed = 0;
      return; //check valid values
    } // debugNmeaFunc(Object.getOwnPropertyNames(gps))


    if (data.quality == "rtk" || data.quality == "rtk-float") {
      // || data.quality == 'dgps-fix' ) { // || data.quality == 'fix') {
      //socketList.emit('log','valid data');
      filter.update({
        A: A,
        B: B,
        C: C,
        H: H,
        R: R,
        Q: Q,
        u: u,
        y: $V([data.lat, data.lon])
      }); //debugNmeaFunc('302 gps.state %s %s', gps.state, gps.latStart)
      // if (!isGPSPositionInitialized) {
      //   InitialisingGPS = true
      //   InitializeFirstFewGPSPositions(socketList);
      // }

      gps.longitude = data.lon;
      gps.latitude = data.lat;
      gps.fix = GPS.ConvertWGS84ToLocal( //northing en easthing berekenen
      gps.latitude, gps.longitude, gps.latStart, gps.lonStart);
      debugNmeaFunc("306 gps.fix %o", gps.fix);
      data.position = {
        cov: filter.P.elements,
        pos: filter.x.elements
      };
      gps.position = data.position;
      msg = 'map:' + gps.fix.easting + ':' + gps.fix.northing + '|xy';
      teleplot.send(msg, 0, msg.length, 47269, '127.0.0.1');
      updateSpeed(); //debugNmeaFunc("gps %o", gps)
      //gps.fix = GPS.ConvertWGS84ToLocal(gps.state.lat, gps.state.lon, gps.latStart, gps.lonStart);

      /*************/
      //TheRest()

      if (s.contour.isRecordOn) {
        recordPath.update(gps.state);
      }

      if (s.autoMow2) {
        pathPlan.update(gps);

        if (s.uTurn) {
          if (s.targetHeading == s.ABLine.heading) {
            if (s.GUI.NMEA.choice === "Simulatie") {
              nmeaStream.nmea.steerangle = -80; //simulatie alleen?
            } //trager de bocht nemen anders maakt hij cirkels omdat de hoek te veel in 1 keer veranderd


            s.GUI.LM = s.autoMowBochtSpeedBinnensteWiel - 40; // bocht onderkant LM 130 | RM 210 => draait te traag => binnenwiel vertragen 20201122

            s.GUI.RM = s.autoMowBochtSpeedBuitensteWiel + 20;
          } else {
            if (s.GUI.NMEA.choice === "Simulatie") {
              nmeaStream.nmea.steerangle = 80;
            }

            s.GUI.LM = s.autoMowBochtSpeedBuitensteWiel; // bocht bovenkant LM 210| RM 130 = OK

            s.GUI.RM = s.autoMowBochtSpeedBinnensteWiel;
          }
        } else {
          sp1();
        }
      }

      if (s.GUI.Autosteer) {
        s.AS.state = 100;
        autosteer.update(gps, socketList);
        AutosteerVorige = true;
        nmeaStream.nmea.stepDistance = 0.05; //(1,8km/u)         

        nmeaStream.nmea.steerangle = s.GUI.mf.guidanceLineSteerAngle * 0.01 * 1.50; // was 0.01*1.5 hogere factor is korter draaien 1.85

        if (s.GUI.NMEA.choice === "Simulatie") {
          s.GUI.angleIMU = nmeaStream.nmea.steerangle; //blauwe pijl
        }
      } else s.GUI.mf.isAutoSteerBtnOn = false;

      if (s.GUI.mission.active) {
        debugNmeaFunc('354 Mission active %o', data);
        mission.update(gps, socketList);

        if (s.mission.data.MissionPlan.State > 205) {
          // was 5
          sp2();
        }
      } else if (!s.GUI.Autosteer) {
        if (AutosteerVorige = true) {
          nmeaStream.nmea.stepDistance = 0.0001; // m/100ms
        }

        AutosteerVorige = false;
      }

      socketList.emit("position", data);
      s.GUI.pos.prev.lat = data.position.pos[0];
      s.GUI.pos.prev.lon = data.position.pos[1];
      noRTKteller = 0;
    } else {
      if (noRTKteller > 5) {
        if (s.GUI.mission.active) {
          s.GUI.LM = 0;
          s.GUI.RM = 0;
        }
      } else {
        noRTKteller++;
        socketList.emit('log', 'geen rtk = stoppen over %s seconden', 1 - noRTKteller / 5);
      } //mower.stop()

    }

    if (s.GUI.driveEnable) {
      // Motoren aansturen
      //driveTest("via gps")
      mower.drive(s.GUI.LM, s.GUI.RM);
    } else {
      mower.stop(); //simulatie valt uit anders?
    }

    UpdateFixPosition(socketList);
    socketList.emit('s', s.GUI);
    socketList.emit('log', {
      text: "GGA data",
      data: s
    });
  });
}

function startParsingUDP(udpClientGPS, s, socketList) {
  debugNmeaFunc("394 startParsingUDP");
  udpClientGPS.on("error", function (error) {
    console.log("Error: " + error);
    udpClientGPS.close();
  });
  udpClientGPS.on("message", function _callee(buffer, info) {
    var data;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = String(buffer); //data = data.slice(0,-2) //als je dit doet => valid = false
            //s.GUI.INFO = data
            //data = data.substring(0, data.length - 1);
            //data = data.replace("*", "0000*")
            //data = data.replace(" $PANDA","$GPGGA")
            //debugNmeaFunc("udpdata = " + data)

            if (!(data != lastData)) {
              _context.next = 14;
              break;
            }

            _context.prev = 2;
            gps.update(data); //stuur een regel door naar gps
            //socket.emit('nmea', gps)//komt op ui/map

            s.GUI.gps = gps;
            _context.next = 12;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](2);

            if (!s.debugGPS) {
              _context.next = 12;
              break;
            }

            debugNmeaFunc("gps not updated => ".concat(_context.t0.name, ": ").concat(_context.t0.message));
            return _context.abrupt("return");

          case 12:
            gps.on("data", function (data) {
              //debugNmeaFunc('417 gpsdata %o', data) // data is zelfde als NDA
              if (gps.state.speed < 10) {
                //20231015 gps.state.speed > 0 && 
                //socket.emit('gpsState', gps.state);//data voor wijzerplaat en grafiek in mapsxx.html
                s.GUI.gps = gps;
              }
            });
            gps.on("NDA", function (data) {
              //data bevat de huidige positie
              if (data.time <= lastTime) {
                // filterd data die dubbel of te laat binnenkomt eruit
                //debugNmeaFunc("Nu : " + data.time )
                //debugNmeaFunc("Vorige: " + lastData)
                return;
              }

              lastTime = data.time;
              debugNmeaFunc("442 NDA data ontvangen %o ", data); //debugNmeaFunc("socketList %o", socketList)
              //var t0 = performance.now();

              if (data.age !== null) {
                socketList.emit("quality", data.quality + " " + data.satellites + " " + data.age); //20201024
              } else {
                socketList.emit("quality", data.time);
              }
              /* if (s.debugGPS) {
                io.emit('log', 'GGAdata= ' + JSON.stringify(data, null, 4));
              }*/
              //let verschil = Date.now() - data.time; //20220605
              //if (s.GUI.NMEA.choice === "GPSudp" && (verschil > 100 || verschil < -5)) return;
              //debugNmeaFunc('now %s, ggatime %s, verschil %s  ', Date.now(), data.time, (Date.now() - data.time)); //sim +36000000
              //debugNmeaFunc(date.now())
              //gps = {"events":{},"state":{"errors":0,"processed":3,"bearing":0,"time":"2022-06-05T22:00:51.100Z","lat":null,"lon":null,"speed":null,"track":null,"alt":null}}
              //debugNmeaFunc("data.raw %s", data.raw)
              //debugNmeaFunc(data.raw)


              s.data = data; //20201124

              if (data.valid === false || data.lat === null || data.lon === null || gps.state.speed > 10 || data.lat < -90 || data.lat > 90 || data.lon < -180 || data.lon > 180) {
                debugNmeaFunc(' 478 bad data'); //mower.stop()
                //io.emit('log', 'invalid data');

                return; //check valid values
              }

              if (data.quality == "rtk" || data.quality == "rtk-float") {
                // || data.quality == 'dgps-fix' ) { // || data.quality == 'fix') {
                //io.emit('log','valid data');
                if (!isJobStarted) {
                  UpdateFixPosition(socketList);
                  return;
                }

                filter.update({
                  A: A,
                  B: B,
                  C: C,
                  H: H,
                  R: R,
                  Q: Q,
                  u: u,
                  y: $V([data.lat, data.lon])
                }); ////debugNmeaFunc('gps %s', gps)

                gps.longitude = data.lon;
                gps.latitude = data.lat;
                gps.fix = GPS.ConvertWGS84ToLocal(gps.latitude, gps.longitude, gps.latStart, gps.lonStart);
                updateSpeed();
                debugNmeaFunc("510 gps.fix %o", gps.fix);
                data.position = {
                  cov: filter.P.elements,
                  pos: filter.x.elements
                }; //debugNmeaFunc(data)
                //s.data = data //gebeurde al in regel 153

                gps.position = data.position; //debugNmeaFunc("gps %o", gps)

                debugNmeaFunc("521 gps.state %o | %o", gps.state, gps.fix); //gps.fix = GPS.ConvertWGS84ToLocal(gps.state.lat, gps.state.lon, gps.latStart, gps.lonStart);

                /*************/
                //TheRest()

                if (s.contour.isRecordOn) {
                  recordPath.update(gps.state);
                } //cc:Contour Opnemen#2; update pathplanning


                if (s.autoMow2) {
                  pathPlan.update(gps);

                  if (s.uTurn) {
                    if (s.targetHeading == s.ABLine.heading) {
                      if (s.GUI.NMEA.choice === "Simulatie") {
                        nmeaStream.nmea.steerangle = -80; //simulatie alleen?
                      } //trager de bocht nemen anders maakt hij cirkels omdat de hoek te veel in 1 keer veranderd


                      s.GUI.LM = s.autoMowBochtSpeedBinnensteWiel - 40; // bocht onderkant LM 130 | RM 210 => draait te traag => binnenwiel vertragen 20201122

                      s.GUI.RM = s.autoMowBochtSpeedBuitensteWiel + 20;
                    } else {
                      if (s.GUI.NMEA.choice === "Simulatie") {
                        nmeaStream.nmea.steerangle = 80;
                      }

                      s.GUI.LM = s.autoMowBochtSpeedBuitensteWiel; // bocht bovenkant LM 210| RM 130 = OK

                      s.GUI.RM = s.autoMowBochtSpeedBinnensteWiel;
                    }
                  } else {
                    sp1();
                  }
                }

                if (s.GUI.Autosteer) {
                  s.AS.state = 100;
                  autosteer.update(gps, socketList);
                  AutosteerVorige = true;
                  nmeaStream.nmea.stepDistance = 0.05; //(1,8km/u)         

                  nmeaStream.nmea.steerangle = s.GUI.mf.guidanceLineSteerAngle * 0.01 * 1.5; // was 0.01*1.5

                  if (s.GUI.NMEA.choice === "Simulatie") {
                    s.angleIMU = nmeaStream.nmea.steerangle; //blauwe pijl
                  }
                } else s.GUI.mf.isAutoSteerBtnOn = false;

                if (s.mission.active) {
                  //debugNmeaFunc('Mission active %o', data)
                  mission.update(gps, socketList);

                  if (s.mission.data.MissionPlan.State > 205) {
                    // was 5
                    sp2();
                  }
                } else if (!s.GUI.Autosteer) {
                  if (AutosteerVorige = true) {
                    nmeaStream.nmea.stepDistance = 0.0001; //20220512 m/100ms
                  }

                  AutosteerVorige = false;
                }

                socketList.emit("position", data); //20201024

                s.pos.prev.lat = data.position.pos[0];
                s.pos.prev.lon = data.position.pos[1];
                noRTKteller = 0; //debugNmeaFunc(data.raw)
              } else {
                if (noRTKteller > 5) {
                  if (s.mission.active) {
                    s.GUI.LM = 0;
                    s.GUI.RM = 0;
                  }
                } else {
                  noRTKteller++; //debugNmeaFunc('geen rtk = stoppen over %s seconden', 1 - noRTKteller/5)
                } //mower.stop()

              }

              if (s.driveEnable) {
                // Motoren aansturen
                //driveTest("via gps")
                mower.drive(s.GUI.LM, s.GUI.RM);
              } else {//mower.stop() //simulatie valt uit anders?
              }

              UpdateFixPosition(socketList);
              socketList.emit('s', s.GUI);
            });

          case 14:
            lastData = data;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 7]]);
  });
  udpClientGPS.on("listening", function () {
    var address = udpClientGPS.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    debugNmeaFunc("611 Server is listening at port " + port);
    debugNmeaFunc("612 Server ip :" + ipaddr);
    debugNmeaFunc("613 Server is IP4/IP6 : " + family);
  }); //emits after the socket is closed using socket.close();

  udpClientGPS.on("close", function () {
    debugNmeaFunc("619 Socket is closed !");
  });
  udpClientGPS.bind(s.UDP.port);
}

function updateSpeed() {
  if (speedCounter > 2) {
    speedCounter = 0;
    dist = GPS.DistanceNE(gps.fix, gps.prevSpeedFix); //in m

    gps.speed = dist * s.gpsHz * 1.2;
    gps.avgSpeed = GPS.AverageTheSpeed(gps.avgSpeed, gps.speed);
    debugNmeaFunc("630 distNE %s, %s, %s", dist, gps.fix, gps.prevSpeedFix);
    gps.prevSpeedFix = gps.fix;
  } else {
    gps.avgSpeed = GPS.AverageTheSpeed(gps.avgSpeed, gps.speed);
  }

  gps.state.speed = gps.avgSpeed;
  s.GUI.speedometer.avgSpeed = gps.avgSpeed;
  s.GUI.speedometer.localHeading = s.ABLine.localHeading;
  s.GUI.speedometer.howManyPathsAway = s.ABLine.howManyPathsAway;
  s.GUI.mf.avgSpeed = gps.avgSpeed;
  speedCounter++;
}

function UpdateFixPosition(socketList) {
  startCounter++;
  debugNmeaFunc("642 gps.state %o", gps.state);

  if (!isGPSPositionInitialized) {
    InitializeFirstFewGPSPositions(socketList);
    socketList.emit('log', {
      text: "nmeaFunc:645 InitGPS"
    });
  } //return process.exit(22);
  //calculate current heading only when moving, otherwise use last


  if (Math.abs(gps.avgSpeed) < 1.5 && !isFirstHeadingSet) {
    TheRest(socketList);
    return;
  }

  if (!isFirstHeadingSet) {
    //set in steer settings, Stanley
    //debugNmeaFunc('hier geraak ik', stepFixPts)
    prevFix.easting = stepFixPts[0].easting;
    prevFix.northing = stepFixPts[0].northing;

    if (stepFixPts[2].isSet == 0) {
      //this is the first position no roll or offset correction
      if (stepFixPts[0].isSet == 0) {
        //debugNmeaFunc("325 in first %o", gps.fix)
        stepFixPts[0].northing = gps.fix.northing;
        stepFixPts[0].easting = gps.fix.easting;
        stepFixPts[0].isSet = 1;
        socketList.emit('log', {
          text: "nmeaFunc:664 in first after",
          data: stepFixPts[0]
        });
        return;
      } //and the second


      if (stepFixPts[1].isSet == 0) {
        //debugNmeaFunc('335 in second [0] %o', stepFixPts[0])
        //debugNmeaFunc('336 in second [1] %o', stepFixPts[1])
        //for (let i = totalFixSteps - 1; i > 0; i--) {
        //  stepFixPts[i] = stepFixPts[i - 1]; werk niet in javacript => kopieert de reference en niet de value
        //  debugNmeaFunc('i = ', i)
        //}
        stepFixPts.pop(); //verwijderd het laatste element: werkt

        stepFixPts.unshift(new vecFix2Fix(gps.fix.easting, 0, gps.fix.northing, 1)); //voegt nieuw punt vooraan toe

        socketList.emit('log', {
          text: "nmeaFunc:682 in second",
          data: stepFixPts
        });
        return;
      } //the critcal moment for checking initial direction/heading.
      // for (let i = totalFixSteps - 1; i > 0; i--) stepFixPts[i] = stepFixPts[i - 1];
      // stepFixPts[0].easting = gps.fix.easting;
      // stepFixPts[0].northing = gps.fix.northing;
      // stepFixPts[0].isSet = 1;


      stepFixPts.pop(); //verwijderd het laatste element

      stepFixPts.unshift(new vecFix2Fix(gps.fix.easting, 0, gps.fix.northing, 1)); //voegt nieuw punt vooraan toe

      socketList.emit('log', {
        text: "nmeaFunc:695 in third",
        data: stepFixPts
      });
      gpsHeading = Math.atan2(gps.fix.easting - stepFixPts[2].easting, gps.fix.northing - stepFixPts[2].northing);
      debugNmeaFunc("701 gpsHeading %s", gpsHeading);
      if (gpsHeading < 0) gpsHeading += 2.0 * Math.PI;else if (gpsHeading > 2.0 * Math.PI) gpsHeading -= 2.0 * Math.PI;
      s.GUI.mf.fixHeading = gpsHeading;
      debugNmeaFunc("706 fixHeading %s°", s.GUI.mf.fixHeading * 180 / Math.PI); //now we have a heading, fix the first 3
      //get the distance from first to 2nd point

      stepFixPts[0].distance = GPS.DistanceNE(stepFixPts[1], stepFixPts[0]);
      gps.fix.easting = stepFixPts[0].easting;
      gps.fix.northing = stepFixPts[0].northing;
      isFirstHeadingSet = true;
      return;
    }
  }

  debugNmeaFunc("716 avg %s, startspeed %s", gps.avgSpeed, gps.startSpeed); //initializing all done

  if (Math.abs(gps.avgSpeed) > gps.startSpeed) {
    isSuperSlow = false; //how far since last fix

    distanceCurrentStepFix = GPS.DistanceNE(stepFixPts[0], gps.fix);
    if (stepFixPts[0].isSet == 0) distanceCurrentStepFix = 0; //save current fix and distance and set as valid

    stepFixPts.pop(); //verwijderd het laatste element

    stepFixPts.unshift(new vecFix2Fix(gps.fix.easting, distanceCurrentStepFix, gps.fix.northing, 1)); //voegt nieuw punt vooraan toe
    //debugNmeaFunc('398 stepFixPts %o', stepFixPts)
    // for (int i = totalFixSteps - 1; i > 0; i--) stepFixPts[i] = stepFixPts[i - 1];
    // stepFixPts[0].easting = pn.fix.easting;
    // stepFixPts[0].northing = pn.fix.northing;
    // stepFixPts[0].isSet = 1;
    // stepFixPts[0].distance = distanceCurrentStepFix;

    if (stepFixPts[3].isSet == 0) {
      TheRest(socketList);
      return;
    }

    dist = 0;

    for (var i = 1; i < totalFixSteps; i++) {
      if (stepFixPts[i].isSet == 0) {
        currentStepFix = i - 1;
        break;
      }

      dist += stepFixPts[i - 1].distance; //debugNmeaFunc('#dist ', dist)

      currentStepFix = i;
      if (dist > minFixStepDist) break;
    } //most recent heading


    var newHeading = Math.atan2(gps.fix.easting - stepFixPts[currentStepFix].easting, gps.fix.northing - stepFixPts[currentStepFix].northing);
    if (newHeading < 0) newHeading += constants.twoPI;else if (newHeading >= constants.twoPI) newHeading -= glm.twoPI;
    s.GUI.speedometer.heading = GPS.toDegrees(newHeading); //debugNmeaFunc("newHeading", newHeading);
    //update the last gps for slow speed.

    lastGPS = gps.fix; //set the headings

    s.GUI.mf.fixHeading = newHeading;
    gpsHeading = newHeading;
  }

  TheRest(socketList); //break

  debugNmeaFunc("779 ABLine " + s.ABLine.isABLineSet);

  if (s.ABLine.isABLineSet && s.GUI.Autosteer) {
    debugNmeaFunc('781 **************Autosteer');
    s.ABLine.GetCurrentABLine(pivotAxlePos, steerAxlePos);
  }
}

function InitializeFirstFewGPSPositions(socketList) {
  socketList.emit('log', {
    text: "nmeaFunc:784 InitGPS ",
    data: startCounter
  });

  if (!isFirstFixPositionSet) {
    if (!isJobStarted) {
      //socketList.emit('log', gps)
      gps.latStart = gps.state.lat;
      gps.lonStart = gps.state.lon;
      GPS.SetLocalMetersPerDegree(gps.latStart);
      isJobStarted = true;
      socketList.emit('log', "gps = " + gps);
    }

    gps.fix = GPS.ConvertWGS84ToLocal(gps.state.lat, gps.state.lon, gps.latStart, gps.lonStart); // pn.fix.northing, out pn.fix.easting);

    socketList.emit('log', {
      text: "nmeaFunc:800 InitGPS",
      data: gps.fix
    });
    debugNmeaFunc("801 firstFix gps.fix = %s ", gps.fix);
    console.dir("first fix %s, %s", gps.fix.easting, gps.fix.northing); //Draw a grid once we know where in the world we are.
    // //most recent fixes

    prevFix.easting = gps.fix.easting;
    prevFix.northing = gps.fix.northing; //debugNmeaFunc(prevFix.GetLength())
    //run once and return
    //if (gps.state.processed > 1) isFirstFixPositionSet = true
    //else return;

    isFirstFixPositionSet = true;
    socketList.emit('log', {
      text: "nmeaFunc:814 FirstFixPositionSet OK"
    });
    return;
  } else {
    prevFix.easting = gps.fix.easting;
    prevFix.northing = gps.fix.northing;
    console.assert(isGPSPositionInitialized, "%o", {
      startCounter: startCounter
    });

    if (startCounter > 9) {
      isGPSPositionInitialized = true;
      socketList.emit('log', {
        text: "nmeaFunc:823 isGPSPositionInitialized OK"
      });
    }

    return;
  }
}

function TheRest(socketList) {
  //positions and headings
  CalculatePositionHeading();
  gps.previousSpeed = gps.avgSpeed;
}

function CalculatePositionHeading() {
  pivotAxlePos.easting = gps.fix.easting; // - (Math.Sin(fixHeading) * vehicle.antennaPivot);

  pivotAxlePos.northing = gps.fix.northing; // - (Math.Cos(fixHeading) * vehicle.antennaPivot);

  pivotAxlePos.heading = s.GUI.mf.fixHeading;
  var guidanceLookDist = gps.avgSpeed * 0.277777 * guidanceLookAheadTime; //(Math.max(tool.toolWidth * 0.5, gps.avgSpeed * 0.277777 * guidanceLookAheadTime));

  s.GUI.mf.guidanceLookPos.easting = pivotAxlePos.easting + Math.sin(s.GUI.mf.fixHeading) * guidanceLookDist;
  s.GUI.mf.guidanceLookPos.northing = pivotAxlePos.northing + Math.cos(s.GUI.mf.fixHeading) * guidanceLookDist;
  debugNmeaFunc("843 guidanceLookDist = %s, lookPosE = %s, lookPosN = %s", guidanceLookDist, s.GUI.mf.guidanceLookPos.easting, s.GUI.mf.guidanceLookPos.northing);
}

function driveTest(t) {
  debugNmeaFunc("851 driveTest vanuit %s", t);
}

function runShellScript(filename) {
  var child = execFile(filename, [], function (error, stdout, stderr) {
    debugNmeaFunc("".concat(filename, " uitvoeren"));

    if (error) {
      //throw error;
      debugNmeaFunc("runShellScripterror ".concat(error)); // opgelet accent = backtick

      return;
    }

    debugNmeaFunc("".concat(filename, " uitgevoerd"));
  });
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function sp1() {
  if (s.uTurn) {
    ctr.update(0);
    s.correction = 0;
  } else {
    s.correction = Math.round(ctr.update(-s.angleError) * 10) / 10;
    s.correction = clamp(s.correction, -90, 90); //-255,255//20200924
    //s.correction = map_range(s.correction, 255,-255,-s.autoMowSpeed, s.autoMowSpeed)

    debugNmeaFunc("878 cor = %s", s.correction); //   s.GUI.LM = s.correction > 0 ? s.autoMowSpeed : s.autoMowSpeed + s.correction;202010
    //   s.GUI.RM = s.correction > 0 ? s.autoMowSpeed - s.correction: s.autoMowSpeed;

    s.GUI.LM = s.correction > 0 ? s.autoMowSpeed : s.autoMowSpeed + s.autoMowSpeed / 90 * s.correction; //20201115

    s.GUI.RM = s.correction > 0 ? s.autoMowSpeed - s.autoMowSpeed / 90 * s.correction : s.autoMowSpeed;
    s.PIDout = s.correction;
  } //debugNmeaFunc(Object.getOwnPropertyNames(nmeaStream))


  if (s.GUI.NMEA.choice === "Simulatie") {
    //let sta = map_range(s.correction, 250,-250,-90,90)//45 was 90
    debugNmeaFunc("896 in sp1 angleError = %s ;targetHeading = %s; steerangle = %s", s.angleError, s.targetHeading, s.correction); //nmeaStream.nmea.steerangle = sta

    nmeaStream.nmea.steerangle = s.correction;

    if (mower.state === "stopped") {
      debugNmeaFunc("904 mower stopped");
      nmeaStream.nmea.stepDistance = 0;
    } else {
      nmeaStream.nmea.stepDistance = 0.025; //m/100ms
    }
  }

  if (s.GUI.NMEA.choice === "GPS") {
    debugNmeaFunc("911 LM:%s, RM:%s", s.GUI.LM, s.GUI.RM);
  }
}

function sp2() {
  if (s.uTurn) {
    s.ctr.update(0);
    s.correction = 0;
  } else {
    s.correction = Math.round(s.ctr.update(-s.angleError) * 10) / 10;
    s.correction = clamp(s.correction, -90, 90); //-255,255//20200924
    //debugNmeaFunc('cor = %s', s.correction)

    s.GUI.LM = s.correction > 0 ? s.autoMowSpeed : s.autoMowSpeed + s.autoMowSpeed / 90 * s.correction; //20201115

    s.GUI.RM = s.correction > 0 ? s.autoMowSpeed - s.autoMowSpeed / 90 * s.correction : s.autoMowSpeed;
    s.PIDout = s.correction;
  } //debugNmeaFunc(Object.getOwnPropertyNames(nmeaStream))


  if (s.GUI.NMEA.choice === "Simulatie") {
    nmeaStream.nmea.steerangle = s.correction;

    if (mower.state === "stopped") {
      debugNmeaFunc("mower stopped");
      nmeaStream.nmea.stepDistance = 0;
    } else {
      nmeaStream.nmea.stepDistance = 0.1;
    }
  } //if (s.GUI.NMEA.choice === "GPS") {
  //debugNmeaFunc('LM:%s, RM:%s', s.GUI.LM, s.GUI.RM);
  //}

}

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}