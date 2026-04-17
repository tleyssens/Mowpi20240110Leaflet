var nmeaSim = require('./NMEAsimTom.js'),
    split = require('split'),
    GPS = require('gps'),
    gps = new GPS
    var Sylvester = require('sylvester'),
        Kalman = require('kalman').KF
    var A = Sylvester.Matrix.I(2);
    var B = Sylvester.Matrix.Zero(2, 2);
    var H = Sylvester.Matrix.I(2);
    var C = Sylvester.Matrix.I(2);
    var Q = Sylvester.Matrix.I(2).multiply(1e-5); //hoger getal => smoother en trager was 1e-5
    var R = Sylvester.Matrix.I(2).multiply(0.000002); //kleiner => sneller     0.000001
    // Measure
    var u = $V([5.3882, 50.996335]); //term.moveTo(1, 5, 'data syl = %s', JSON.stringify(u, null, 4)).eraseLineAfter();
    var filter = new Kalman($V([0, 0]), $M([
            [1, 0],
            [0, 1]
        ]));
    var prev = {
            lat: null,
            lon: null
          }

const nmeaSimStream = new nmeaSim(500);

exports.startStream = function (socket) {
    console.log('in nmeaFunc' + socket)
    parser = nmeaSimStream.pipe(split('\r\n'))
    parser.on('data', function (data) { //ontvangt data van simulatie regel per regel
        //console.log('parserData', data)
        //socket.emit('nmea', data )// data.quality + " " + data.satellites + " " + data.hdop);
        try {
            gps.update(data); //stuur een regel door naar gps
            //console.log(gps)
            //socket.emit('nmea', gps)
        } catch (e) {
            //if (s.debugGPS) {
                console.log('gps not updated')
                console.log(`error${e.name}: ${e.message}`);
            //}
        }
    })
    gps.on('GGA', function (data) { //data bevat de huidige positie
        //var t0 = performance.now();
        socket.emit('quality', data.quality + " " + data.satellites + " " + data.hdop);
        /* if (s.debugGPS) {
          //io.emit('log', 'GGAdata= ' + JSON.stringify(data, null, 4));
        }*/
        if (data.valid === false || data.lat === null || data.lon === null || gps.state.speed > 5 || data.lat < -90 || data.lat > 90 || data.lon < -180 || data.lon > 180) {
          //fullStop();
          //io.emit('log', 'invalid data');
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
        }
        socket.emit('position', data);
    })  
}
exports.stopStream = function () {
  nmeaSimStream.pause()
}
exports.KeyReceived = function (data) {
	//console.log('in KeyReceived nmeaFunc');
	//console.log(data);
	switch (data.Key) {
		case "Steering":
			var X = parseFloat(data.steer);
      var Y = parseFloat(data.speed);
      //console.log('data.steer '+ data.steer + ' X '+ X + ' Y  '+ Y)
      nmeaSimStream.nmea.steerangle = map_range(X, -250,250,-90,90)
      nmeaSimStream.nmea.stepDistance = map_range(Y,-250,250,-0.5,0.5)
      break
  }
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
exports.startFileStream = function (socket) {
    console.log('in StartFileStream');
            function os_func() {
                this.execCommand = function (cmd, callback) {
                    exec(cmd, (err, stdout, stderr) => {
                        if (err) {
                            console.log('error str2str' + err);
                            io.emit('log', err);
                            return;
                        }
                        callback(stdout);
                    });
                };
            };
            var os = new os_func();
            os.execCommand('pkill -9 str2str', function (returnvalue) {});
            os.execCommand('../rtk/str2str -in ../rtk/LogThuis1.ntrip::T::x1::+330 -out tcpsvr://:52000', function (returnvalue) {});
            client.connect(52000, '127.0.0.1', function () {
                console.log('nmea-client connected');
                io.emit('log', 'Connected to NS-HP-output');
            }); //client krijgt constant data van de str2str naar poort 52000
            var stream = client.pipe(split('\r\n'));
            return stream ;
}
