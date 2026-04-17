'use strict';
/*
str2str -in ntrip://89777a001:46544@flepos.vlaanderen.be:2101/FLEPOSVRS31GR#rtcm3 -out serial://ttyUSB0:57600:8:n:1:off -out tcpsvr://:5000 -p 51.01777649 5.37416649 103.00 -s 100000 -n 5000

*/
var s = require('../public/settings.json') //laad json-data uit bestand
const common = require('./common.js')
const spi = require('spi-device')

const app = common.express()
const httpServer = common.http.createServer(app)
const io = require('socket.io')(httpServer)
var nmeaSim = require('../lib/NMEAsimTom.js')
var split = require('split')
var nmeaSimStream
var util = require('util')
var sim
var parser;
console.clear();
const {
  fork
} = require('child_process')
const log4js = require('log4js')
log4js.configure({
  appenders: {
    fileAppender: {
      type: 'file',
      filename: '../logs/test.log',
      append: false
    }
  },
  categories: {
    default: {
      appenders: ['fileAppender'],
      level: 'info'
    }
  }
});
const log = log4js.getLogger();
log.level = 'debug';

let Rtrack = 2 * s.Rmin * s.Rmin
const {
  exec
} = require('child_process');

//simulatie of the real thing
if (s.simulatie == true && s.simulatie.type == 1) {
  s.driveEnable = false;
  console.log('simType 1')
  let sim = new common.simu()
  parser = sim.streamStart(io)
} else if (s.simulatie == true && s.simulatie.type == 3) {
  s.driveEnable = false; //was false
  nmeaSimStream = new nmeaSim(500)
  console.log(util.inspect(nmeaSimStream, true, 3, true))//showHidden=true, depth=3, colorize=true))
  console.log(util.inspect(nmeaSimStream.nmea, true, 3, true))
  console.log('simType 3')
  parser = nmeaSimStream.pipe(split('\r\n'))
} else {
  console.log('connect GPS')
  const port = new common.SerialPort('/dev/ttyUSB1', {
    baudRate: 115200
  })
  parser = port.pipe(new common.Readline({
    delimiter: '\n',
    encoding: 'utf8'
  }));
}

var
  GPS = require('gps'),
  Gpio = require('pigpio').Gpio,
  //Motor = require('./lib/TomMotor.js'), //geo = require('.lib/TomGeolib.js'), bij in gps.js gezet
  PIDcontroller = require('node-pid-controller')

  /*
  LMotor = new common.Motor.Setup(11, 10, 9, 10, 150), //11,10,9
  RMotor = new common.Motor.Setup(22, 27, 17, 10, 150), //22,27,17

  MES1 = new Gpio(18, {
    mode: Gpio.OUTPUT
  }),
  MES2 = new Gpio(25, {
    mode: Gpio.OUTPUT
  }), // 7/8/25 zijn vrij??
  pulswidth = 1000,
  BATLOW = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.RISING_EDGE
  }),
  BatEmpty = 0,
  BOTSR = new Gpio(23, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.RISING_EDGE
  }),
  BOTSL = new Gpio(24, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.RISING_EDGE
  })
  */

/////////////  SPI  /////////////////
const CS = new Gpio(8, {
  mode: Gpio.OUTPUT})
CS.digitalWrite(1);  

////////////

var automowtimer;
var chunk = "";
var gps = new GPS;
//if (s.simulatie.type == 3) {gps.state.speed = s.simulatie.speed}
var alpha = 0.4,
  bufferSize = 0,
  targetLat = 0,
  targetLon = 0,
  targetHeading = 0,
  targetDistance = 0,
  minDistance = 0.1, //meter
  angleError = 0,
  tempbearing = 0,
  n = 1,
  CV = 0,
  prev = {
    lat: null,
    lon: null
  },
  tempstate = {
    lat: null,
    lon: null
  },
  a = 0,
  b = 0,
  c = 0,
  P = 0.0,
  I = 0,
  D = 0,
  Imax = 100,
  Dmax = 180,
  last_Error = 0,
  kp = 3.3, //0.25		
  ki = 0.115, //0.1
  kd = 1.76, //0.02
  avg = [],
  positions = [],
  traject = [],
  targets = [],
  angleErrorA = [],
  target = {
    lat: null,
    lon: null,
    n: null
  },
  prevTrajectLat = 0,
  prevTrajectLon = 0,
  trajectLat = 0,
  trajectLon = 0,
  trajectDistance = 0,
  Cirkel1 = false;

gps.state.bearing = 0;
let ctr = new PIDcontroller({
  k_p: kp,
  k_i: ki,
  k_d: kd,
  //dt: 1,
  i_max: Imax,
  target: 0
});
// Simple Kalman Filter set up
var A = common.Sylvester.Matrix.I(2);
var B = common.Sylvester.Matrix.Zero(2, 2);
var H = common.Sylvester.Matrix.I(2);
var C = common.Sylvester.Matrix.I(2);
var Q = common.Sylvester.Matrix.I(2).multiply(1e-5); //hoger getal => smoother en trager was 1e-5
var R = common.Sylvester.Matrix.I(2).multiply(0.000002); //kleiner => sneller     0.000001
// Measure
var u = $V([5.3882, 50.996335]); //term.moveTo(1, 5, 'data syl = %s', JSON.stringify(u, null, 4)).eraseLineAfter();
var filter = new common.Kalman($V([0, 0]), $M([
  [1, 0],
  [0, 1]
]));

//Setting the path to static assets
app.use(common.express.static('public'));
app.use(common.express.static(__dirname + '/app'));
app.use(common.express.static(__dirname + '/vendor/dist'));

httpServer.listen(3000);

app.get('/', function (req, res) { //Serving the static HTML files
  res.sendFile(__dirname + '/index.html')
});
app.get('/map/', function (req, res) {
  res.sendFile(__dirname + '/maps51.html');
});
app.get('/setup/', function (req, res) {
  res.sendFile(__dirname + '/setup.html')
})
app.get('/log/', function (req, res) {
  res.sendFile(__dirname + '/log/log.html');
});

if (s.debugGPS) {
  io.emit('log', JSON.stringify(gps, null, 4));
}

parser.on('data', function (data) { //ontvangt data van ns-hp regel per regel
  //io.emit('log', data);
  if (s.debugGPS) {
    io.emit('nmea', data)
  }
  try {
    gps.update(data); //stuur een regel door naar gps
    //console.log(gps)
  } catch (e) {
    if (s.debugGPS) {
      console.log('gps not updated')
      io.emit('log', e.name + ': ' + e.message);
    }
  }
});
gps.on('GGA', function (data) { //data bevat de huidige positie
  //var t0 = performance.now();
  io.emit('quality', data.quality + " " + data.satellites + " " + data.hdop);
  if (s.debugGPS) {
    //io.emit('log', 'GGAdata= ' + JSON.stringify(data, null, 4));
  }
  if (data.valid === false || data.lat === null || data.lon === null || gps.state.speed > 5 || data.lat < -90 || data.lat > 90 || data.lon < -180 || data.lon > 180) {
    //fullStop();
    io.emit('log', 'invalid data');
    return //check valid values
  }

  if (data.quality == 'rtk' || data.quality == 'rtk-float' || data.quality == 'dgps-fix' ) { // || data.quality == 'fix') {
    //io.emit('log','valid data');
    filter.update({
      A: A,
      B: B,
      C: C,
      H: H,
      R: R,
      Q: Q,
      u: u,
      y: $V([data.lat, data.lon])
    });

    data.position = {
      cov: filter.P.elements,
      pos: filter.x.elements
    };

    if (s.recPath.isRecordOn) {
      let contourTriggerDistance = GPS.Distance(s.recPath.prevContourPos.lat, s.recPath.prevContourPos.lng, gps.state.lat, gps.state.lon) * 1000;
      console.log(s.recPath.prevContourPos.lat + ',' + s.recPath.prevContourPos.lng + '|' +  gps.state.lat + ',' + gps.state.lon)
      
      //console.log('contourTriggerDistance' + contourTriggerDistance)
      // timer start
      //console.time('label1');
      if (contourTriggerDistance > s.recPath.contourTriggerStepDistance) {
        AddContourPathPoints()
      }
      
    }
    if (prev.lat !== null && prev.lon !== null) {
      if (prev.lat !== data.position.pos[0]) { //was gps.state.lat
        tempstate.lat = data.position.pos[0]; //(1 - alpha) * data.position.pos[0] + alpha * prev.lat; // smoothed    //was gps.state.lat  // Nieuwe positie berekend
        tempstate.lon = data.position.pos[1]; //(1 - alpha) * data.position.pos[1] + alpha * prev.lon;// was gps.state.lon

        if (positions.length == 0) {
          positions.push(tempstate.lat, tempstate.lon);
        };
        if (positions.length) {
          var distance1 = GPS.Distance(tempstate.lat, tempstate.lon, positions[0], positions[1]) * 1000; //km naar meter
          if (distance1 > minDistance) { //als de nieuwe positie meer dan 0.1m weg is van het vorige punt=> bereken de richting
            gps.state.bearing = GPS.Heading(positions[0], positions[1], tempstate.lat, tempstate.lon); //geeft waarde van 0 tot 360
            if (s.debugGPS) {
              log.debug('gps bearing gezet op : %s', gps.state.bearing);
            }
            positions[0] = tempstate.lat; // positions bevat de oude positie
            positions[1] = tempstate.lon;
          }
        }

        targetHeading = GPS.Heading(data.position.pos[0], data.position.pos[1], targetLat, targetLon); //geeft een waarde van 0 tot 360 graden
        //targetDistance = 1000 * GPS.Distance(gps.state.lat, gps.state.lon, targetLat, targetLon); //test
        //io.emit('log','targetHeading = '+ targetHeading);
        io.emit('targetHeading', targetHeading);

        angleError = targetHeading - gps.state.bearing;

        if (angleError > 180) angleError -= 360;
        if (angleError < -180) angleError += 360;

        io.emit('angleError', angleError);
      }
    }
    //console.log(util.inspect(nmeaSimStream, true, 3, true))//showHidden=true, depth=3, colorize=true))
    //nmeaSimStream.nmea.steerangle += 2
    //nmeaSimStream.setSteer(15)
    //setTimeout(function() {nmeaSimStream.nmea.steerangle = -50},10000)
    //nmeaSimStream.nmea.stepDistance = 0.2 
    //if (targetDistance < 10 && gps.state.speed < 10) {
      io.emit('position', data);
    //}
    prev.lat = data.position.pos[0];
    prev.lon = data.position.pos[1];

    if (s.autoMow === 1) {
      if (s.prevAutoMow === 0) {
        io.emit('log', 'in prevAutoMow');
        var latLng1 = {
          lat: null,
          lng: null
        };
        latLng1.lat = gps.state.lat;
        latLng1.lng = gps.state.lon;
        traject.unshift(latLng1); //voeg huidige postie toe aan voorkant array => startpunt // nog aanpassen => gps.state.lat kan fout zijn!!!!!!!
        io.emit('log', 'traject na druk op automatisch ' + JSON.stringify(traject, null, 4));
        prevTrajectLat = traject[0].lat;
        prevTrajectLon = traject[0].lng;
        trajectLat = traject[1].lat;
        trajectLon = traject[1].lng;
        trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter 
        target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 8 / trajectDistance); //eerste punt ligt 0,8m verder
        let startStat = {
          start: '' + latLng1.lat + ' ' + latLng1.lng,
          doel: '' + trajectLat + ' ' + trajectLon,
          Distance: trajectDistance,
          TussenTarget: target
        }
        io.emit('log', JSON.stringify(startStat, null, 4));
        targetLat = target.lat;
        targetLon = target.lon;
        if (target.lat == null) {
          //log.error('ERROR in eerste iteratie: target.lat = null');
        } else {
          targets.push(target)
          target.n = targets.length;
          io.emit('target', target);
        }
        s.prevAutoMow = 1;
        return;
      }

      targetDistance = 1000 * GPS.Distance(gps.state.lat, gps.state.lon, targetLat, targetLon); //in meter
      io.emit('log', 'targetDistance ' + target.n.toString() + ' = ' + targetDistance);
      if (targetDistance < (minDistance * 3)) {
        // bijna aan target
        trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter
        io.emit('log', 'trajectDistance n = ' + trajectDistance + ' | trajectlengte = ' + traject.length);
        if (trajectDistance < (minDistance * 8)) {
          // bijna aan trajectpunt => neem het volgende trajectpunt. Als aan laatste punt, rij terug naar het eerste
          if (n <= traject.length) {
            n++;
          } else {
            n = 1;
          };
          //io.emit('log', 'traject['+n+'].lat = ' + traject[n].lat );
          prevTrajectLat = trajectLat;
          prevTrajectLon = trajectLon;
          trajectLat = traject[n].lat;
          trajectLon = traject[n].lng;

          trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter
          if (trajectDistance == 0) {
            s.autoMow = 0;
            return
          }
          //io.emit('log', 'traject '+ n + ' prev= '+ prevTrajectLat + ', ' + prevTrajectLon +' nieuw='+ trajectLat + ', ' + trajectLon + ' minDistance '+ minDistance +' trajectDistance =' + trajectDistance);
          target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 3 / trajectDistance);
          //io.emit('log', 'target1' + JSON.stringify(target, null, 4));
          targetLat = target.lat;
          targetLon = target.lon;
        } else { //we zijn nog ver van trajectpunt weg dus bereken een tussenpunt
          prevTrajectLat = targetLat;
          prevTrajectLon = targetLon;
          target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 4 / trajectDistance);
          //io.emit('log', 'target2 '+ n + ' prev= '+ prevTrajectLat + ', ' + prevTrajectLon +' nieuw='+ trajectLat + ', ' + trajectLon + ' minDistance '+ minDistance +' trajectDistance =' + trajectDistance);    
          targetLat = target.lat;
          targetLon = target.lon;
          //io.emit('log', 'target2' + JSON.stringify(target, null, 4));
        };
        if (target.lat !== null) {
          io.emit('log', target.lat);
          targets.push(target)
          target.n = targets.length;
          io.emit('target', target);
        } else {
          io.emit('log', 'error: target.lat = null');
        }
      }
      sp1(); // PID + motorsnelheden berekenen
      // timer end, where the difference between the timer start and timer end is printed out

    }
    if (s.autoMow1 === 1) {
      console.log('In automow 1');
      var latLng1 = {
        lat: null,
        lng: null
      };
      var D2R = Math.PI / 180;
      latLng1.lat = gps.state.lat;
      latLng1.lng = gps.state.lon;
      traject.shift(); // verwijder eerste element uit array
      traject.unshift(latLng1); // Voeg huidig punt toe vooraan in array
      trajectDistance = 1000 * GPS.Distance(traject[1].lat, traject[1].lng, traject[2].lat, traject[2].lng); //in meter 
      var trajectHeading = GPS.Heading(traject[1].lat, traject[1].lng, traject[2].lat, traject[2].lng);
      var distA = 1000 * GPS.Distance(traject[0].lat, traject[0].lng, traject[1].lat, traject[1].lng); //in meter 
      var headingA = GPS.Heading(traject[1].lat, traject[1].lng, traject[0].lat, traject[0].lng);
      var angleA = headingA - trajectHeading;
      //var distToLine = Math.sin(angleA * D2R) * distA;
      let circleRadius = la.calculateLaCircle(angleA, distA, 1);
      let circleRadius1 = la.calculateLaCircle1(angleA, distA, 1, gps.state.bearing);
      var distB = 1000 * GPS.Distance(traject[0].lat, traject[0].lng, traject[2].lat, traject[2].lng);
      var headingB = GPS.Heading(traject[2].lat, traject[2].lng, traject[0].lat, traject[0].lng);
      let lap = (gps.state.speed * 10 / 36) * laSec;
      io.emit('log', 'AB-distance:' + trajectDistance + ' | AB-heading:' + trajectHeading + ' | distA:' + distA + ' | headA:' + headingA + ' | angleA:' + angleA + ' | circleR:' + circleRadius + ' | circleR1:' + circleRadius1 + ' | lap:' + lap);
      //autoMow1 = 0;
    }
    if (s.autoMow2) {
      //let testPoint = {lat : 50.99633068680789, lng: 5.388207002220042}
      if(s.uTurn) {
        return
      }
      if (!s.ABLine.set) { 
      //  setABLineByHeading()
        targetHeading = s.ABLine.heading
        s.ABLine.set = true
      } else {

        if(contains(s.recPath.recList, gps.state.lat, gps.state.lon )) {
          console.log('punt binnen contour')
          angleError = targetHeading - gps.state.bearing;
          console.log('angleError '+ angleError)
          //sp1()
        } else {
          //s.uTurn = true

          //s.driveEnable = false
          targetHeading = s.ABLine.heading + 180
          //doUturn(s.uTurnDir, targetHeading)
        } 
      }
    }
    
    /*if (Cirkel1 === true) {
      DriveCirkel1(220,70);
    }*/
    if (s.debugGPS) { //let timer = console.timeEnd('label1');// werkt niet
      // timer stop
      //console.timeEnd('label1');
    }
  } else {
    //fullStop();
  }
  //var t1 = performance.now();
  //console.log("GGA duurt " + (t1 - t0) + " milliseconds.")
});

io.attach(httpServer);

//Set heartbeat interval
io.set('heartbeat timeout', 3000);
io.set('heartbeat interval', 1500);

io.on('connection', function (socket) {
  //process.stdout.write(" " + data.length + " bytes\r");
  console.log('socket connected: %s', socket.id);
  //console.log(socket)
  socket.on('disconnect', reason => {
    console.log(`reason: ${reason}`);
  });
  /*socket.on('disconnect', function () {
      log.info('Lost connection: %s', socket.id);
    fullStop();
    mes(0);
  });*/

  /*socket.on('ping1', function() { //ping werkt niet!!
    socket.emit('pong1');
  });*/
  socket.on('AutoMow', function () { //eerste iteratie
    if (s.autoMow === 1) {
      s.autoMow = 0;
      s.prevAutoMow = 0; //reden van deze var => In dit gedeelte kan er een fout zitten in de gpsdata => Eerste trajectpunt fout
      mes(0);
      //clearInterval(automowtimer);
      fullStop();
    } else { //rij van startpunt(=traject[0]) naar traject[1]
      s.autoMow = 1;
    }
    //console.log("On Auto " + autoMow);
  });
  socket.on('AutoMow1', function () {
    if (s.autoMow1 === 1) {
      s.autoMow1 = 0;
      mes(0);
      fullStop();
    } else {
      var latLng1 = {
        lat: null,
        lng: null
      };
      var D2R = Math.PI / 180;
      latLng1.lat = gps.state.lat;
      latLng1.lng = gps.state.lon;
      console.log('Huidige positie = ' + JSON.stringify(latLng1, null, 4));
      traject.unshift(latLng1); // Voeg huidig punt toe vooraan in array [0]=huidig [1]=A, [2]=B
      console.log('AB-Traject na druk op automatisch ' + JSON.stringify(traject, null, 4));
      trajectDistance = 1000 * GPS.Distance(traject[1].lat, traject[1].lng, traject[2].lat, traject[2].lng); //in meter 
      var trajectHeading = GPS.Heading(traject[1].lat, traject[1].lng, traject[2].lat, traject[2].lng);
      //term.moveTo(1, 3, "AB-Distance %s |AB-Heading = %s", trajectDistance, trajectHeading).eraseLineAfter();
      var distA = 1000 * GPS.Distance(traject[0].lat, traject[0].lng, traject[1].lat, traject[1].lng); //in meter 
      var headingA = GPS.Heading(traject[1].lat, traject[1].lng, traject[0].lat, traject[0].lng);
      var angleA = headingA - trajectHeading;
      console.log('distA = ' + distA + ' | headingA = ' + headingA + ' | angleA = ' + angleA);
      var distToLine = Math.sin(angleA * D2R) * distA;
      console.log('                                                       distToLine = ' + distToLine);
      let circleRadius = la.calculateLaCircle(angleA, distA, 2);
      //(head + 360) % 360

      var distB = 1000 * GPS.Distance(traject[0].lat, traject[0].lng, traject[2].lat, traject[2].lng);
      var headingB = GPS.Heading(traject[2].lat, traject[2].lng, traject[0].lat, traject[0].lng);
      console.log('distB = ' + distB + ' | headingB = ' + headingB);
      s.autoMow1 = 1;
    }
    console.log('AutoMow1 = ' + s.autoMow1);
  });
  
  socket.on('Cirkel1', function () {
    console.log('ServerMsg: Cirkel1 ontvangen');
    if (Cirkel1 === true) {
      io.emit('log', 'In Cirkel1');
      Cirkel1 = false;
      //s.prevAutoMow = 0; //reden van deze var => In dit gedeelte kan er een fout zitten in de gpsdata => Eerste trajectpunt fout
      mes(0);
      LMotor.drive(0);
      RMotor.drive(0);
    } else {
      Cirkel1 = true;
      DriveCirkel1(220, 70);
    }
  });
  socket.on('Simulatie', function () {
    s.simulatie = (s.simulatie ? false : true);
  })
  socket.on('Mes', function () {
    if (s.MaaiMES === 0 && s.mesStop === 0) {
      console.log('Messen Aan');
      s.MaaiMES = 1;
      fullStop();
      mes(1);
    } else {
      console.log('Messen Uit');
      s.MaaiMES = 0;
      mes(0);
    };
  });
  socket.on('DriveEnable', function () {
    s.driveEnable = (s.driveEnable ? false : true);
    console.log('DriveEnable = ' + s.driveEnable);
  });
  socket.on('AutoMow2', function () {
    s.autoMow2 = (s.autoMow2 ? false : true);
    console.log('AutoMow2 = ' + s.autoMow2);
  });

  socket.on('RpiAfsluiten', function () {
    console.log("RPI afsluiten");
    mes(0);
    fullStop();
    exec('sh /usr/local/bin/halt.sh', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  });

  socket.on('Turn', function () {
    console.log('On Turn');
    bots("R", 1);
  });

  socket.on('View', function () {
    console.log('On View');
    view();
  });



  socket.on('FixedRoute1', function () {
    let latLng = {
      lat: 50.99629729666667,
      lng: 5.38810004
    };
    traject.push(latLng);
    latLng = {
      lat: 50.99635351166667,
      lng: 5.388101745
    };
    traject.push(latLng);
    latLng = {
      lat: 50.99635269833333,
      lng: 5.388129326666666
    }; 
    traject.push(latLng);
    latLng = {
      lat: 50.99634035166667,
      lng: 5.388133221666667
    }; 
    traject.push(latLng);
    latLng = {
      lat: 50.996348865,
      lng: 5.388251015
    }; 
    traject.push(latLng);
    latLng = {
      lat: 50.99645291666667,
      lng: 5.388219263333333
    }; 
    traject.push(latLng);
    latLng = {
      lat: 50.996448351666665,
      lng: 5.3882316716666665
    }; 
    traject.push(latLng);
    latLng = {
      lat: 50.99631090333333,
      lng: 5.388256788333333
    }; 
    traject.push(latLng);
    latLng = {
      lat: 50.99629420833333,
      lng: 5.388094798333333
    }; 
    traject.push(latLng); 
    //traject.push(latLng4);
    console.log('traject1 ' + JSON.stringify(traject, null, 4));
    io.emit('traject', traject);
  });
  socket.on('FixedRoute2', function () {     
var latLng1 = {
      lat: 51.050887,
      lng: 5.304699
    };
    traject.push(latLng1);
    var latLng2 = {
      lat:  51.051213,
      lng: 5.304622
    };
    traject.push(latLng2);
    var latLng3 = {
      lat: 51.051236,
      lng: 5.304847
    };
    traject.push(latLng3);
    var latLng4 = {
      lat: 51.050908,
      lng: 5.304919
    };
    traject.push(latLng4);
    traject.push({ lat:51.050886, lng: 5.304728})
    traject.push({ lat: 51.051198, lng: 5.304647})
    traject.push({ lat: 51.051218, lng: 5.304826})
    traject. push({ lat: 51.050925, lng: 5.304891})
    
    console.log('traject 2 ' + JSON.stringify(traject, null, 4));
    io.emit('traject', traject);
  });
  socket.on('ToonTraject', function () {
    ToonTraject();
  });
  socket.on('WisTraject', function () {
    traject.length = 0;
    io.emit('log', 'traject gewist' + JSON.stringify(traject, null, 4));
  });
  socket.on('AddPoint', function () {
    var latLng1 = {
      lat: null,
      lng: null
    };
    latLng1.lat = gps.state.lat;
    latLng1.lng = gps.state.lon;
    traject.push(latLng1); //voeg huidige postie toe aan voorkant array => startpunt // nog aanpassen => gps.state.lat kan fout zijn!!!!!!!
    io.emit('log', 'traject na AddPoint ' + JSON.stringify(traject, null, 4));
  })
  socket.on('RecordContour', function () {
    s.recPath.isRecordOn = (s.recPath.isRecordOn ? false : true);
    console.log('record contour = ' + s.recPath.isRecordOn);
    console.log('contour = ' + s.recPath.recList)
  })


  socket.on('key', KeyReceived); //Key received from client
});
io.on('disconnect', function (socket) {
  console.log('io disconnected: %s', socket.id);
  //fullStop();
});

function toBytesInt16 (num) {
    const arr = new ArrayBuffer(2); // an Int32 takes 4 bytes
    const view = new DataView(arr);
    view.setInt16(0, num, false); // byteOffset = 0; litteEndian = false
    return arr;
}
function toBytesInt16_2 (num) {
    const arr = new Uint8Array([
         (num & 0x0000ff00) >> 8,
         (num & 0x000000ff)
    ]);
    return Array.from(arr);
}
function SendSpiCMD(CMD, TR1, TR2) {  
  const buffer = new ArrayBuffer(6)
  const SpiArray = new Int16Array(buffer)
  const view = new DataView(buffer)
  view.setInt16(0,CMD)
  view.setInt16(2,TR1)
  view.setInt16(4,TR2)
  console.log(Buffer.from(SpiArray.buffer));
  // An SPI message is an array of one or more read+write transfers
  const message = [{
    sendBuffer: Buffer.from(SpiArray.buffer), // Sent
    receiveBuffer: Buffer.alloc(6),              // Raw data read
    byteLength: 6,
    speedHz: 200000 // Use a low bus speed
  }];
  const T3_2 = spi.open(0, 0, err => {
    if (err) throw err;
    T3_2.transfer(message, (err, message) => {
      if (err) throw err;
      //console.log(message[0]);
      //console.log(message[1]);
      // Convert raw value from sensor to celcius and log to console
      //const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) +
      // message[0].receiveBuffer[2];
      //const voltage = rawValue * 3.3 / 1023;
      //const celcius = (voltage - 0.5) * 100;
      //console.log("recieve" + message[0].receiveBuffer[0] + "; " + message[0].receiveBuffer[1] + "; " + message[0].receiveBuffer[2]+ "; " + message[0].receiveBuffer[3])
      //console.log(rawValue);
    })
  })
}

function ToonTraject() {

}
function AddContourPathPoints() {
  //s.recPath.recList.push(gps.state.lat, gps.state.lon,gps.state.bearing)
  s.recPath.recList.push({"lat": gps.state.lat, "lng": gps.state.lon,"head":gps.state.bearing})
  s.recPath.prevContourPos.lat = gps.state.lat
  s.recPath.prevContourPos.lng = gps.state.lon
  //console.log(JSON.stringify(s))
  console.log('aantal contourpunten = ' + s.recPath.recList.length)
}
function IsPointInContourArea (testPoint)  {
  if (s.recPath.recList.length < 3) { return false }
  let j = s.recPath.recList.length - 1
  let inside = false
  for (i = 0; i < s.recPath.recList.length; j = i++)
            {
                if ((s.recPath.recList[i].lat < testPoint.lat && s.recPath.recList[j].lat >= testPointv2.lat)
                || (s.recPath.recList[j].lat < testPointv2.lat && s.recPath.recList[i].lat >= testPointv2.lat))
                {
                    oddNodes ^= ((testPointv2.northing * calcList[i].northing) + calcList[i].easting < testPointv2.easting);
                }
            }
}
/**
 * @return {boolean} true if (lng, lat) is in bounds
 */
function contains(bounds, lat, lng) {
    //https://rosettacode.org/wiki/Ray-casting_algorithm
    var count = 0;
    
    for (var b = 0; b < bounds.length; b++) {
        var vertex1 = bounds[b];
        var vertex2 = bounds[(b + 1) % bounds.length];
        if (west(vertex1, vertex2, lng, lat))
            ++count;
    }
    return count % 2;
 
    /**
     * @return {boolean} true if (x,y) is west of the line segment connecting A and B
     */
    function west(A, B, x, y) {
        //console.log('vertex1 ' + JSON.stringify(A))
        if (A.lat <= B.lat) {
            if (y <= A.lat || y > B.lat ||
                x >= A.lng && x >= B.lng) {
                return false;
            } else if (x < A.lng && x < B.lng) {
                return true;
            } else {
                return (y - A.lat) / (x - A.lng) > (B.lat - A.lat) / (B.lng - A.lng);
            }
        } else {
            return west(B, A, x, y);
        }
    }
}
function setABLineByHeading() {
  s.ABLine.refABLineP1.lng = s.ABLine.refPoint1.lng - (Math.Sin(s.ABLine.heading) * 4000.0);
  s.ABLine.refABLineP1.lat = s.ABLine.refPoint1.lat - (Math.Cos(s.ABLine.heading) * 4000.0);

  s.ABLine.refABLineP2.lng = s.ABLine.refPoint1.lng + (Math.Sin(s.ABLine.heading) * 4000.0);
  s.ABLine.refABLineP2.lat = s.ABLine.refPoint1.lat + (Math.Cos(s.ABLine.heading) * 4000.0);

  s.ABLine.refPoint2.lng = s.ABLine.refABLineP2.lng;
  s.ABLine.refPoint2.lat = s.ABLine.refABLineP2.lat;

  s.ABLine.set = true;
}
function calcFuturePoint(lat0, lon0, heading) {
  //radiusEarthKilometers = 6371.01f
  //kmDistance = kmSpeed * (timer1.Interval / 1000f) / 3600f;
  //kmDistance = 0.001


            var distRatio = kmDistance / radiusEarthKilometres;
            var distRatioSine = Math.Sin(distRatio);
            var distRatioCosine = Math.Cos(distRatio);

            var startLatRad = deg2rad(lat0);
            var startLonRad = deg2rad(lon0);

            var startLatCos = Math.Cos(startLatRad);
            var startLatSin = Math.Sin(startLatRad);

            var endLatRads = Math.Asin((startLatSin * distRatioCosine) + (startLatCos * distRatioSine * Math.Cos(angleRadHeading)));

            var endLonRads = startLonRad
                + Math.Atan2(Math.Sin(angleRadHeading) * distRatioSine * startLatCos,
                    distRatioCosine - startLatSin * Math.Sin(endLatRads));

            newLat = rad2deg(endLatRads);
            newLong = rad2deg(endLonRads);
}

function doUturn(direction) {
  if (direction == R) {
    DriveCirkel1(100, -10)
  } else {
    DriveCirkel1(-10, 100)
  }
  
}

function DriveCirkel1(LM1, RM1) {
  if (s.driveEnable) {
    //console.log('in drive' + LM1);
    LMotor.drive(parseInt(LM1));
    RMotor.drive(parseInt(RM1));
  } else {
    LMotor.drive(0);
    RMotor.drive(0);
  };
}

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

function sp1() {
  let correction = Math.round(ctr.update(angleError));
  correction = clamp(correction, -255, 255);
  let LM = correction > 0 ? 255 - correction : 255;
  let RM = correction > 0 ? 255 : 255 + correction;
  let Mot = {
    'PIDout': correction,
    'LM': LM,
    'RM': RM
  };
  io.emit('Mot', Mot);
  console.log('correction' + correction + 'LM: ' + LM + ' | RM: ' + RM);
  nmeaSimStream.nmea.steerangle = map_range(correction, 255,-255,-90,90)
  nmeaSimStream.nmea.stepDistance = 0.2
  if (s.driveEnable) {
    SendSpiCMD(1,parseInt(LM),parseInt(RM)); //Rijden
    //LMotor.drive(parseInt(LM));   //RMotor.drive(parseInt(RM));
  } else {
    SendSpiCMD(1,0,0); //Stop
  };
}
/*BATLOW.on('interrupt', function (level) {
  BatEmpty += 1;
  if (bat === 0) {
    console.log("Interrupt: Batterij is leeg => level = " + level);
    batterij(BatEmpty, level);
  }
});*/
process.on('SIGINT', exit);

function KeyReceived(data) {
  //console.log('in KeyReceived');
  //console.log(data);
  switch (data.Key) {
    case "Steering":
      var X = parseFloat(data.steer);
      var Y = parseFloat(data.speed);
      if (s.simulatie.type == 3) {
        console.log('data.steer '+ data.steer + ' X '+ X + ' Y  '+ Y)
        nmeaSimStream.nmea.steerangle = map_range(X, -250,250,-90,90)
        nmeaSimStream.nmea.stepDistance = map_range(Y,-250,250,-0.5,0.5)
      }
      //sp1();
      //console.log('Steering');
      steeringMath(X, Y);
      break;
    case "clickTarget":
      targetLat = data.value.latLng.lat;
      targetLon = data.value.latLng.lng;
      traject.push(data.value.latLng);
      io.emit('log', 'punt toegevoegd aan traject: ' + JSON.stringify(traject, null, 4));
      break;
    case "Pvalue":
      console.log('Pvalue = ' + JSON.stringify(data, null, 4));
      ctr.k_p = data.value;
      break;
    case "Ivalue":
      console.log('Ivalue = ' + JSON.stringify(data, null, 4));
      ctr.k_i = data.value;
      break;
    case "Dvalue":
      console.log('Dvalue = ' + JSON.stringify(data, null, 4));
      ctr.k_d = data.value;
      break;
  }
}

function steeringMath(X, Y) {
  //console.log('in steeringMath X:%s, Y:%s', X, Y);
  var V = (250 - Math.abs(X)) * (Y / 250) + Y;
  var W = (250 - Math.abs(Y)) * (X / 250) + X;
  var LM = (V + W) / 2; // - 17;
  var RM = (V - W) / 2; // + 4;
  let Mot = {
    'PIDout': 0,
    'LM': LM,
    'RM': RM
  };
  console.log('in steeringMath X:%s, Y:%s, LM:%s, RM:%s', X, Y, LM, RM);
  io.emit('Mot', Mot);
  if (s.driveEnable) {
    SendSpiCMD(1,parseInt(LM),parseInt(RM)); //rijden
  } else {
    SendSpiCMD(1,0,0); //motor snelheid op 0
  };
}

function mes(level) {
  if (level === 1) { //messen starten
    
    //MES1.digitalWrite(1); //mes1 starten
    setTimeout(function () { //mes2 starten na 0,5 sec
      //MES2.servoWrite(1700); //1000 tot 2000 is de draaisnelheid van het mes
    }, 500);
  } else { //messen Stoppen
    //MES1.digitalWrite(0);
    //MES2.servoWrite(1000);
  }
}

function batterij(n, level) {
  if (n > 1 && level === 1 && bat === 0) {
    console.log("Aantal batterijmeldingen = " + n + "over 70 minuten stopt het mes");
    bat = 1;
    t4 = setTimeout(function () {
      console.log("Batterij leeg = stoppen");
      s.mesStop = 1;
      s.MaaiMES = 0;
      fullStop();
      mes(0);
      //bat =0;
    }, 4200000); //600000 = 10 minuten, 3600000 = 60 min, 4200000 = 70 min
  }
}

function bots( side, level) {
  if (back === 0 && level === 1) {
    if (typeof t1 !== 'undefined') {
      console.log('clearTimeouts');
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    }
    fullStop();
    console.log(side + ' aan');
    backoff(side);
    back = 1;
  }
}

function backoff(side) {
  console.log("stopping in backoff " + side);

  t1 = setTimeout(function () {
    if (side === "R") {
      console.log('achteruit R');
      LMotor.Forward = false;
      RMotor.Forward = false;
      LMotor.ramp(180, 6); // even getallen gebruiken!!
      RMotor.ramp(255, 4);
      back = 0;
    } else {
      console.log('achteruit L');
      LMotor.Forward = false;
      RMotor.Forward = false;
      LMotor.ramp(255, 4); // even getallen gebruiken!!
      RMotor.ramp(180, 6);
      back = 0;
    };
  }, 500);

  t2 = setTimeout(function () {
    console.log('in Backoff na achteruit.');
    back = 0;
    LMotor.ramp(0, 4);
    RMotor.ramp(0, 4);
  }, 3500);

  t3 = setTimeout(function () {
    console.log('terug vooruit');
    mes(0);
    LMotor.toggleDirection();
    RMotor.toggleDirection();
    mes(1);
    LMotor.ramp(230, 4); // even getallen gebruiken!!
    RMotor.ramp(240, 4);
    //back = 0;
  }, 5500)
}

function fullStop() {
  console.log('in fullStop');
  SendSpiCMD(1,0,0);    // wielen stop
  //LMotor.stop();  RMotor.stop();
  mes(0);
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function exit() {
  mes(0);
  fullStop();
  setTimeout(function () {
    if (s.simulatie) {
      exec('sudo pkill str2str', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return; // 
        }
      });
    }
    //LMotor.cleanup();
    //RMotor.cleanup();
    console.log('bye');
    process.exit();
  }, 2000)
}
