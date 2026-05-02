"use strict"
const { s, Mower } = require("../bin/config");
//const { stopStream1 } = require('./nmeaFunc');
var mower = Mower;

var GPS = require('gps'),
    positions = []

exports.update = function (gps) {
    //cc:Contour Opnemen#3; Als gereden afstand > triggerAfstand => voeg punt toe aan contourPath
    if (s.contour.isRecordOn) {
        if (s.contour.prevPos.lat = 0) {
            s.contour.prevPos.lat = gps.state.lat
            s.contour.prevPos.lng = gps.state.lon
        }
        let contourDriveDistance = GPS.Distance(s.contour.prevPos.lat, s.contour.prevPos.lng, gps.state.lat, gps.state.lon) * 1000;
        
        console.log(s.contour.prevPos.lat + ',' + s.contour.prevPos.lng + '|' +  gps.state.lat + ',' + gps.state.lon)
            
        console.log('contourDriveDistance' + contourDriveDistance)
        // timer start
        //console.time('label1');
        if (contourDriveDistance > s.contour.TriggerDistance) {
            AddContourPathPoints(gps.state)
            console.log("punt Toegevoegd")
        }
    } 
    if (s.pos.prev.lat !== null && s.pos.prev.lon !== null) {
        if (s.pos.prev.lat !== s.data.position.pos[0]) { //was gps.state.lat
            s.pos.temp.lat = s.data.position.pos[0]; //(1 - alpha) * data.position.pos[0] + alpha * prev.lat; // smoothed    //was gps.state.lat  // Nieuwe positie berekend
            s.pos.temp.lon = s.data.position.pos[1]; //(1 - alpha) * data.position.pos[1] + alpha * prev.lon;// was gps.state.lon
            
            if (positions.length == 0) {
                positions.push(s.pos.temp.lat, s.pos.temp.lon);
            };
            if (positions.length) {               
                s.distance1 = GPS.Distance(s.pos.temp.lat, s.pos.temp.lon, positions[0], positions[1]) * 1000; //km naar meter
                gps.state.bearing = GPS.Heading(positions[0], positions[1], s.pos.temp.lat, s.pos.temp.lon); //geeft waarde van 0 tot 360
                if (gps.state.bearing > 180) gps.state.bearing -= 360;
                if (gps.state.bearing < -180) gps.state.bearing += 360;
                if (s.distance1 > s.pos.minDistance) { //als de nieuwe positie meer dan 0.1m weg is van het vorige punt=> bereken de richting
                    //if (s.debugGPS) {
                        console.log('gps bearing gezet op : %s', gps.state.bearing);
                    //}
                    positions[0] = s.pos.temp.lat; // positions bevat de oude positie
                    positions[1] = s.pos.temp.lon;
                }
                //else {console.log('fout')}
            }
            if(!s.autoMow2) {
            //if(!s.autoMow3) {
                s.targetHeading = GPS.Heading(s.data.position.pos[0], s.data.position.pos[1], s.pos.target.lat, s.pos.target.lon); //geeft een waarde van 0 tot 360 graden
                //targetDistance = 1000 * GPS.Distance(gps.state.lat, gps.state.lon, targetLat, targetLon); //test
                //io.emit('log','targetHeading = '+ targetHeading);
                //io.emit('targetHeading', targetHeading);
                s.angleError = s.targetHeading - gps.state.bearing;
                //io.emit('angleError', angleError);
            }
        } else { console.log('s.pos.prev.lat gelijk aan s.data.prev.lon')}
    }   
    //cc:AutoMow#4;stay inside
    if (s.autoMow2 || s.autoMow3) {
        //let testPoint = {lat : 50.99633068680789, lng: 5.388207002220042}
        if(s.uTurn) {
            s.angleError = s.targetHeading - gps.state.bearing;
            if (s.angleError > 180) s.angleError -= 360;
            if (s.angleError < -180) s.angleError += 360;
            console.log('in Uturn. AngleE = %s', s.angleError)
            if (Math.abs(s.angleError) < 15) { // dit bepaald hoever hij draait na de Uturn. bij 10 gaat hij dikwijls over dezelfde weg terug.
                console.log('hoek OK')
                s.uTurn = false
            }
            return
        }
        if (!s.ABLine.set) { 
        //  setABLineByHeading()
            s.targetHeading = s.ABLine.heading
            s.ABLine.set = true
        } else {
            s.futurePoint = destinationPoint(gps.state.lat, gps.state.lon, 1.5, gps.state.bearing) // 1.5m voor het bereiken van de contourrand draait hem terug
            console.log ('newLat = %s, newLon = %s',s.futurePoint[0], s.futurePoint[1])
            //if(contains(s.contour.recList, gps.state.lat, gps.state.lon )) {
            if(contains(s.contour.recList, s.futurePoint[0], s.futurePoint[1] )) {
                //s.targetHeading = s.ABLine.heading
                console.log('futurePoint binnen contour => targetHeading = %s', s.targetHeading)
                //nmeaSimStream.nmea.steerangle = map_range(correction, 255,-255,-90,90)
                s.contour.prevInside = true
                s.uTurn = false
            } else {
                if (s.contour.prevInside) {
                    s.uTurn = true
                    s.targetHeading += 180
                    //s.targetHeading = ((s.targetHeading + 360) % 360) klopt niet
                    if (s.targetHeading > 180) s.targetHeading -= 360;
                    if (s.targetHeading < -180) s.targetHeading += 360;
                    s.contour.prevInside = false
                }
                console.log('bijna buiten contour = omkeren => targetHeading = %s', s.targetHeading)
                if(contains(s.contour.recList, gps.state.lat, gps.state.lon)) {
                } else {
                    console.log('Buiten contour => stoppen')
                    s.driveEnable = false
                    gps.state.speed = 0
                    s.GUI.LM = 0
                    s.GUI.RM = 0
                    mower.stop()
                    //nmeaStream.nmea.stepDistance
                    s.autoMow2 = false
                }
            } 
        }
        s.angleError = s.targetHeading - gps.state.bearing;
    }
    if (s.angleError > 180) s.angleError -= 360;
    if (s.angleError < -180) s.angleError += 360;
}
//cc:Contour Opnemen#4; Punt toevoegen aan contourPath in s
function AddContourPathPoints(state) {
    //s.recPath.recList.push(gps.state.lat, gps.state.lon,gps.state.bearing)
    //s.contour.recList.push({"lat": gps.state.lat, "lng": gps.state.lon})//,"head":gps.state.bearing})
    s.contour.recList.push([state.lat, state.lon])
    s.contour.prevPos.lat = state.lat
    s.contour.prevPos.lng = state.lon
    console.log(JSON.stringify(s.contour.recList))
    console.log('aantal contourpunten = ' + s.contour.recList.length)
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
function doUturn(direction,targetHeading) {
    if (direction == R) {
      DriveCirkel1(100, -10)
    } else {
      DriveCirkel1(-10, 100)
    } 
}
function calcFuturePoint(lat0, lon0, heading) {
    radiusEarthKilometers = 6371.01
    //kmDistance = kmSpeed * (timer1.Interval / 1000f) / 3600f;
    kmDistance = 0.001 //km??
  
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
  
              s.futurePoint.newLat = rad2deg(endLatRads);
              s.futurePoint.newLon = rad2deg(endLonRads);
  }
  function deg2rad(deg) {
      return deg * Math.PI / 180
  }
  function rad2deg(rad) {
      return rad * (180 / Math.PI)
  }
/**
  * Returns the destination point from a given point, having travelled the given distance
  * on the given initial bearing.
  *
  * @param   {number} lat - initial latitude in decimal degrees (eg. 50.123)
  * @param   {number} lon - initial longitude in decimal degrees (e.g. -4.321)
  * @param   {number} distance - Distance travelled (metres).
  * @param   {number} bearing - Initial bearing (in degrees from north).
  * @returns {array} destination point as [latitude,longitude] (e.g. [50.123, -4.321])
  *
  * @example
  *     var p = destinationPoint(51.4778, -0.0015, 7794, 300.7); // 51.5135°N, 000.0983°W
  */
 function destinationPoint(lat, lon, distance, bearing) {
    var radius = 6371e3; // (Mean) radius of earth

    var toRadians = function(v) { return v * Math.PI / 180; };
    var toDegrees = function(v) { return v * 180 / Math.PI; };

    // sinφ2 = sinφ1·cosδ + cosφ1·sinδ·cosθ
    // tanΔλ = sinθ·sinδ·cosφ1 / cosδ−sinφ1·sinφ2
    // see mathforum.org/library/drmath/view/52049.html for derivation

    var δ = Number(distance) / radius; // angular distance in radians
    var θ = toRadians(Number(bearing));

    var φ1 = toRadians(Number(lat));
    var λ1 = toRadians(Number(lon));

    var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
    var sinδ = Math.sin(δ), cosδ = Math.cos(δ);
    var sinθ = Math.sin(θ), cosθ = Math.cos(θ);

    var sinφ2 = sinφ1*cosδ + cosφ1*sinδ*cosθ;
    var φ2 = Math.asin(sinφ2);
    var y = sinθ * sinδ * cosφ1;
    var x = cosδ - sinφ1 * sinφ2;
    var λ2 = λ1 + Math.atan2(y, x);

    return [toDegrees(φ2), (toDegrees(λ2)+540)%360-180]; // normalise to −180..+180°
 }