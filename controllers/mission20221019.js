"use strict";
let missionDebug = require("debug")("tom:mission");
var s = require("../bin/settings.json"),
  Dubins = import("../DubinsJS/dubins.js"),
  GeographicLib = require("geographiclib"),
  geod = GeographicLib.Geodesic.WGS84,
  positions = [],
  traject = [],
  targets = [],
  targetHeading = 0,
  targetDistance = 0,
  minDistance = 0.05, //meter 5cm
  n = 1,
  GPS = require("gps"),
  latLng1 = {
    lat: null,
    lng: null,
  },
  latlng = [],
  prev = {
    lat: null,
    lon: null,
  },
  prePrevTrajectLat = 0,
  prePrevTrajectLon = 0,
  prevTrajectLat = 0,
  prevTrajectLon = 0,
  trajectLat = 0,
  trajectLon = 0,
  trajectDistance = 0,
  target = {
    lat: null,
    lon: null,
    n: null,
  },
  targetLat = 0,
  targetLon = 0,
  pathSection = [],
  missionPath = [];

//let dubWorker = new Dubins()
//missionDebug(dubWorker)
exports.update = function (gps, socketList) {
  /*Object.entries(s).forEach(
    ([key, value]) => missionDebug(key, value)
	);*/

  switch (s.mission.data.MissionPlan.State) {
    case 200: //Loop over contouren + voeg route naar huis toe
      missionDebug("case 200");
      missionPath.push.apply(
        missionPath,
        s.mission.data.MissionPlan.StartRoute
      ); // voeg weg naar Startpunt toe

      traject = s.mission.data.MissionPlan.MowArea.contour;
      Object.values(s.mission.data.MissionPlan.MowList).forEach((value) => {
        missionDebug(value);
        //traject = value
        let wp_14 = waypoints(
          value[0][0],
          value[0][1],
          value[3][0],
          value[3][1]
        );
        let wp_23 = waypoints(
          value[1][0],
          value[1][1],
          value[2][0],
          value[2][1]
        );
        let wp_12 = waypoints(
          value[0][0],
          value[0][1],
          value[1][0],
          value[1][1]
        );
        let wp_34 = waypoints(
          value[2][0],
          value[2][1],
          value[3][0],
          value[3][1]
        );
        if (s.mission.data.MissionPlan.MowArea.type == "parallel") {
          pathSection = path(wp_14, wp_23);
        } else if (s.mission.data.MissionPlan.MowArea.type == "squared") {
          pathSection = circlePath(value); //steeds kleiner wordende vierkanten
        }
        //socketList.emit('missionPath', pathSection) //teken geel path in map
        missionPath.push.apply(missionPath, pathSection); // voeg nieuwe array toe aan eerste array
      });
      missionPath.push.apply(missionPath, s.mission.data.MissionPlan.HomeRoute); // voeg weg naar home toe
      //socketList.emit('missionPath', s.mission.data.MissionPlan.HomeRoute) //teken route naar huis op map
      socketList.emit("missionPath", missionPath); //teken route op map
      //missionDebug(missionPath)
      // all units in degrees
      const newPoints = [];
      const turning_radius = 0.00001; // ~ 1 meter
      const step_size = 0.000003; // ~ .3 meters

      // last point of first segment, assuming array of latLng's
      //let firstSegment = missionPath
      const start = missionPath[0];

      // compute heading between second to last and last point
      const startHeading = GPS.Heading(
        missionPath[0][0],
        missionPath[0][1],
        missionPath[1][0],
        missionPath[1][1]
      );
      missionDebug("start : %s |  heading : %s", start, startHeading);
      // first point of last segment, assuming array of latLng's
      const end = missionPath[missionPath.length - 1];
      // compute heading between first and second point
      //const endHeading = GPS.Heading(endHeading[0][0], endHeading[0][0], endHeading[1][0], endHeading[1][1])
      const endHeading = GPS.Heading(
        missionPath[missionPath.length - 2][0],
        missionPath[missionPath.length - 2][1],
        missionPath[missionPath.length - 1][0],
        missionPath[missionPath.length - 1][1]
      );
      missionDebug("end : %s |  heading : %s", end, endHeading);
      //const dubWorker = new Dubins()
      //missionDebug(Dubins)
      // dubWorker.shortestAndSample([
      // 		// start x, y, and heading
      // 		start.lat(),
      // 		start.lng(),
      // 		startHeading * (Math.PI / 180) // then convert to radians
      // 	], [
      // 		// end x, y, and heading
      // 		end.lat(),
      // 		end.lng(),
      // 		endHeading * (Math.PI / 180) // then convert to radians
      // 	], turning_radius, step_size, (q, _) => {
      // 		// callback
      // 		newPoints.push([q[0], q[1]])
      // 		missionDebug('newPoints : %s' , newPoints)
      // 		//return 0
      // 	})

      setTimeout(timeout3, 10000, "Wachttijd RTK Om");
      s.mission.data.MissionPlan.State = 201;
      break;
    case 201:
      missionDebug("case 201");
      s.mission.data.MissionPlan.State = 202;
      break;
    case 202: // secties samenvoegen
      //missionDebug('case 202 wachttijd RTK')
      break;
    case 203: // komt hierin door setTimeout
      missionDebug("case 203 missionPath berekenen + dubins?");
      missionDebug(Dubins);
      //traject = s.mission.data.MissionPlan.MowArea.contour
      traject = missionPath;
      //s.mission.log += ('||traject103 = ' + traject)//JSON.stringify(traject, null, 4));
      //traject.unshift(s.mission.data.MissionPlan.MowArea.start)//startpunt mowarea toevoegen aan begin traject
      //s.mission.data.MissionPlan.MowArea.start.lon = s.mission.data.MissionPlan.MowArea.start.lng
      //s.mission.data.MissionPlan.MowArea.start.n = "MowAreaStart"
      //socketList.emit('targetA', s.mission.data.MissionPlan.MowArea.start)
      //setTimeout(timeout2, 2000, 'Tijd Om')// // wacht tot RTK beetje stabiel is en roept functie timeout aan onderaan
      s.mission.data.MissionPlan.State = 205;
      break;
    case 205:
      missionDebug("in case 205");
      latlng[0] = gps.position.pos[0];
      latlng[1] = gps.position.pos[1];
      latlng[2] = "huidige positie";
      socketList.emit("targetA", latlng);
      //s.mission.log += ('||Huidige positie = ' + latlng)
      traject.unshift(latlng); // Voeg huidig punt toe vooraan in array [0]=huidig [1]=A, [2]=B
      s.mission.log +=
        "||traject met huidige positie + startpunt MowArea + contour = " +
        traject; //JSON.stringify(traject, null, 4));
      prevTrajectLat = traject[0][0];
      prevTrajectLon = traject[0][1];
      trajectLat = traject[1][0];
      trajectLon = traject[1][1];
      trajectDistance =
        1000 *
        GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter
      s.mission.log += "||trajectDistance = " + trajectDistance;
      target = GPS.intermediatePoint(
        prevTrajectLat,
        prevTrajectLon,
        trajectLat,
        trajectLon,
        (minDistance * 16) / trajectDistance
      ); //eerste punt ligt 0,8m verder
      targets.push(target);
      target.n = targets.length;
      s.mission.target = target;
      s.mission.log += "||target = " + JSON.stringify(target, null, 4);
      socketList.emit("target", target);
      targetLat = target.lat;
      targetLon = target.lon;
      missionDebug(JSON.stringify(s.mission.log, null, 4));

      s.mission.data.MissionPlan.State = 210;

      s.pos.prev.lat = s.data.position.pos[0];
      s.pos.prev.lon = s.data.position.pos[1];
      break;
    case 210:
      //missionDebug('case 210')
      if (s.pos.prev.lat !== null && s.pos.prev.lon !== null) {
        if (s.pos.prev.lat !== s.data.position.pos[0]) {
          //was gps.state.lat
          s.pos.temp.lat = s.data.position.pos[0]; //(1 - alpha) * data.position.pos[0] + alpha * prev.lat; // smoothed    //was gps.state.lat  // Nieuwe positie berekend
          s.pos.temp.lon = s.data.position.pos[1]; //(1 - alpha) * data.position.pos[1] + alpha * prev.lon;// was gps.state.lon

          if (positions.length == 0) {
            positions.push(s.pos.temp.lat, s.pos.temp.lon);
          }
          if (positions.length) {
            s.distance1 =
              GPS.Distance(
                s.pos.temp.lat,
                s.pos.temp.lon,
                positions[0],
                positions[1]
              ) * 1000; //km naar meter
            gps.state.bearing = GPS.Heading(
              positions[0],
              positions[1],
              s.pos.temp.lat,
              s.pos.temp.lon
            ); //geeft waarde van 0 tot 360
            if (gps.state.bearing > 180) gps.state.bearing -= 360;
            if (gps.state.bearing < -180) gps.state.bearing += 360;
            if (s.distance1 > s.pos.minDistance * 2) {
              //als de nieuwe positie meer dan 0.1m weg is van het vorige punt=> bereken de richting
              if (s.debugGPS) {
                missionDebug("gps bearing gezet op : %s", gps.state.bearing);
              }
              //s.futurePoint = destinationPoint(gps.state.lat, gps.state.lon, 1.5, gps.state.bearing) //kruisjes berekenen
              positions[0] = s.pos.temp.lat; // positions bevat de oude positie
              positions[1] = s.pos.temp.lon;
            }
            //else {missionDebug('fout')}
            s.nearestPoint = getPerp(
              prePrevTrajectLat,
              prePrevTrajectLon,
              trajectLat,
              trajectLon,
              gps.state.lat,
              gps.state.lon
            );
            //missionDebug("gps.state.lat = %s, gps.state.lon = %s", gps.state.lat, gps.state.lon)
            //if (s.nearestPoint) { // 20221009 geeft nog foute waarden
            //	socketList.emit('futurePoint', s.nearestPoint )
            //prePrevTrajectLat = 50.99633803088063, prePrevTrajectLon = 5.388113596289941
            //trajectLat = 50.99632061164357, trajectLon = 5.388112765831651
            //gps.state.lat = 50.99632532166667, gps.state.lon = 5.38818418
            //}
          }
        } else {
          missionDebug(" info : s.pos.prev.lat gelijk aan s.data.prev.lon");
          break;
        }
      }
      targetDistance =
        1000 *
        GPS.Distance(
          gps.position.pos[0],
          gps.position.pos[1],
          targetLat,
          targetLon
        ); //in meter

      if (targetDistance < minDistance * 10) {
        //was 3//5 0.05*10=0.5m
        // bijna aan target
        trajectDistance =
          1000 *
          GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter
        if (trajectDistance < minDistance * 5) {
          // was 15//6  0.05*5=25cm
          // bijna aan trajectpunt => neem het volgende trajectpunt. Als aan laatste punt, rij terug naar het eerste
          if (n <= traject.length) {
            n++;
          } else {
            //n = 1;// keer terug naar eerste punt
            s.mission.data.MissionPlan.State = 215;
          }
          //io.emit('log', 'traject['+n+'].lat = ' + traject[n].lat );
          prePrevTrajectLat = prevTrajectLat;
          prePrevTrajectLon = prevTrajectLon;
          prevTrajectLat = trajectLat;
          prevTrajectLon = trajectLon;
          trajectLat = traject[n][0]; //.lat;
          trajectLon = traject[n][1]; //.lng;

          trajectDistance =
            1000 *
            GPS.Distance(
              prevTrajectLat,
              prevTrajectLon,
              trajectLat,
              trajectLon
            ); //in meter
          if (trajectDistance == 0) {
            s.autoMow = 0;
            return;
          }
          //io.emit('log', 'traject '+ n + ' prev= '+ prevTrajectLat + ', ' + prevTrajectLon +' nieuw='+ trajectLat + ', ' + trajectLon + ' minDistance '+ minDistance +' trajectDistance =' + trajectDistance);
          target = GPS.intermediatePoint(
            prevTrajectLat,
            prevTrajectLon,
            trajectLat,
            trajectLon,
            (minDistance * 3) / trajectDistance
          ); //was 3//8
          //socketList.emit('target', target)//werkt niet?
          //io.emit('log', 'target1' + JSON.stringify(target, null, 4));
          targetLat = target.lat;
          targetLon = target.lon;
        } else {
          //we zijn nog ver van trajectpunt weg dus bereken een tussenpunt
          prevTrajectLat = targetLat;
          prevTrajectLon = targetLon;
          target = GPS.intermediatePoint(
            prevTrajectLat,
            prevTrajectLon,
            trajectLat,
            trajectLon,
            (minDistance * 4) / trajectDistance
          ); //was 4//10 0.05*4/
          targetLat = target.lat;
          targetLon = target.lon;
        }
        if (target.lat !== null) {
          //io.emit('log', target.lat)
          targets.push(target);
          target.n = targets.length;
          socketList.emit("target", target);
        }
      }
      s.targetHeading = GPS.Heading(
        gps.position.pos[0],
        gps.position.pos[1],
        targetLat,
        targetLon
      ); //geeft een waarde van 0 tot 360 graden
      //missionDebug('targetHead ==> %s', s.targetHeading)
      if (s.targetHeading > 180) s.targetHeading -= 360;
      if (s.targetHeading < -180) s.targetHeading += 360;
      s.angleError = s.targetHeading - gps.state.bearing;
      //minder schommelen rond rechte lijn?
      // if(s.angleError < 5 && s.angleError > -5) {
      // 	s.angleError = 0
      // }
      if (s.angleError > 180) s.angleError -= 360;
      if (s.angleError < -180) s.angleError += 360;
      //	missionDebug('gps = ' + JSON.stringify(gps, null, 4));
      //missionDebug('=> targetHeading = %s, => angleError = %s, => bearing = %s ', s.targetHeading, s.angleError, gps.state.bearing)
      break;
    case 215: //gedaan met maaien
      missionDebug("In case 215: maaien gedaan");
      socketList.emit("targetA", s.mission.data.MissionPlan.MowArea.start);
      s.mission.active = false;
      //mower.state = "stopped"
      break;
    case 220: //motoren stoppen
      missionDebug("motoren stoppen");
      break;
  }
};

function timeout(arg) {
  // wacht tot RTK beetje stabiel is
  missionDebug(`arg was => ${arg}`);
  s.mission.data.MissionPlan.State = 5; //was 5
}

function timeout2(arg) {
  // wacht tot RTK beetje stabiel is
  missionDebug(`arg was => ${arg}`);
  s.mission.data.MissionPlan.State = 103; //was 5
}

function timeout3(arg) {
  // wacht tot RTK beetje stabiel is
  missionDebug(`arg was => ${arg}`);
  s.mission.data.MissionPlan.State = 203; //was 5
}

function waypoints(lat1, lon1, lat2, lon2) {
  let wp = [];
  let ds = 0.5; //is the distance between waypoints which correspond to blade width We use 1 meter as the blade is 110cm.
  let l = geod.InverseLine(lat1, lon1, lat2, lon2);
  //missionDebug('l = ', l)
  let n = Math.round(Math.ceil(l.s13 / ds));
  //missionDebug('n = ', n)
  for (let i = 0; i < n + 1; i++) {
    // in range(n+1):
    if (i === 0) {
      //missionDebug("distance latitude longitude")
    }
    let s = Math.min(ds * i, l.s13);
    //missionDebug('s = ', s)
    let g = l.Position(
      s,
      GeographicLib.Geodesic.STANDARD | GeographicLib.Geodesic.LONG_UNROLL
    );
    wp.push([g["lat2"], g["lon2"]]);
    //missionDebug('%s %s %s',g['s12'].toFixed(0), g['lat2'].toFixed(6), g['lon2'].toFixed(6))
    //missionDebug(wp)
  }
  return wp;
}

function path(wp14, wp23) {
  // stroken heen en terug met bocht 180°
  //missionDebug('Navigation path coordinates: ')
  let count14 = 0,
    count23 = 0,
    is14 = true,
    pathList = [];
  missionDebug(
    "wp lengths 1-4 : %s, 2-3 : %s , min : %s",
    wp14.length,
    wp23.length,
    Math.min(wp14.length, wp23.length)
  );
  for (let i = 0; i < Math.min(wp14.length, wp23.length) - 1; i++) {
    if (is14) {
      if (count14 != 0) {
        pathList.push(wp14[count14]);
        missionDebug(
          "WP14-%s  %s , %s",
          count14,
          wp14[count14][0],
          wp14[count14][1]
        );
        count14 += 1;
      }
      pathList.push(wp14[count14]);
      missionDebug(
        "WP14-%s  %s , %s",
        count14,
        wp14[count14][0],
        wp14[count14][1]
      );
      count14 += 1;
      is14 = false;
    } else {
      pathList.push(wp23[count23]);
      missionDebug(
        "WP23-%s  %s , %s",
        count23,
        wp23[count23][0],
        wp23[count23][1]
      );
      count23 += 1;
      pathList.push(wp23[count23]);
      missionDebug(
        "WP23-%s  %s , %s",
        count23,
        wp23[count23][0],
        wp23[count23][1]
      );
      count23 += 1;
      is14 = true;
    }
    missionDebug("i: %s, count14: %s, count23: %s", i, count14, count23);
  }
  return pathList;
}

function circlePath(traject) {
  //Steeds kleiner wordende vierkanten rijden
  let pathList = [];
  let wp_14 = waypoints(
    traject[0][0],
    traject[0][1],
    traject[3][0],
    traject[3][1]
  );
  let wp_41 = waypoints(
    traject[3][0],
    traject[3][1],
    traject[0][0],
    traject[0][1]
  );
  let wp_23 = waypoints(
    traject[1][0],
    traject[1][1],
    traject[2][0],
    traject[2][1]
  );
  let wp_32 = waypoints(
    traject[2][0],
    traject[2][1],
    traject[1][0],
    traject[1][1]
  );
  let wp_12 = waypoints(
    traject[0][0],
    traject[0][1],
    traject[1][0],
    traject[1][1]
  );
  let wp_34 = waypoints(
    traject[2][0],
    traject[2][1],
    traject[3][0],
    traject[3][1]
  );
  let turns = [wp_12.length, wp_23.length, wp_34.length, wp_41.length];
  turns.sort(function (a, b) {
    return a - b;
  });
  missionDebug(turns);
  //missionDebug('12_lengte =%s, 23_length=%s, 34_lengte=%s, 41_length=%s',wp_12.length, wp_23.length, wp_34.length, wp_41.length)
  //for (let i=0; i<Math.floor((Math.max(wp_12.length, wp_23.length, wp_34.length, wp_41.length)/4+1)); i++) {
  for (let i = 0; i < turns[1] / 2; i++) {
    pathList.push(wp_14[0]);
    pathList.push(wp_23[0]);
    pathList.push(wp_32[0]);
    pathList.push(wp_41[0]);
    pathList.push(wp_14[1]);
    let wp_56 = waypoints(wp_14[1][0], wp_14[1][1], wp_23[1][0], wp_23[1][1]);
    let wp_65 = waypoints(wp_23[1][0], wp_23[1][1], wp_14[1][0], wp_14[1][1]);
    let wp_78 = waypoints(wp_32[1][0], wp_32[1][1], wp_41[1][0], wp_41[1][1]);
    let wp_87 = waypoints(wp_41[1][0], wp_41[1][1], wp_32[1][0], wp_32[1][1]);

    wp_14 = waypoints(wp_56[1][0], wp_56[1][1], wp_87[1][0], wp_87[1][1]);
    wp_41 = waypoints(wp_87[1][0], wp_87[1][1], wp_56[1][0], wp_56[1][1]);
    wp_23 = waypoints(wp_65[1][0], wp_65[1][1], wp_78[1][0], wp_78[1][1]);
    wp_32 = waypoints(wp_78[1][0], wp_78[1][1], wp_65[1][0], wp_65[1][1]);
  }
  return pathList;
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

  var toRadians = function (v) {
    return (v * Math.PI) / 180;
  };
  var toDegrees = function (v) {
    return (v * 180) / Math.PI;
  };

  // sinφ2 = sinφ1·cosδ + cosφ1·sinδ·cosθ
  // tanΔλ = sinθ·sinδ·cosφ1 / cosδ−sinφ1·sinφ2
  // see mathforum.org/library/drmath/view/52049.html for derivation

  var δ = Number(distance) / radius; // angular distance in radians
  var θ = toRadians(Number(bearing));

  var φ1 = toRadians(Number(lat));
  var λ1 = toRadians(Number(lon));

  var sinφ1 = Math.sin(φ1),
    cosφ1 = Math.cos(φ1);
  var sinδ = Math.sin(δ),
    cosδ = Math.cos(δ);
  var sinθ = Math.sin(θ),
    cosθ = Math.cos(θ);

  var sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * cosθ;
  var φ2 = Math.asin(sinφ2);
  var y = sinθ * sinδ * cosφ1;
  var x = cosδ - sinφ1 * sinφ2;
  var λ2 = λ1 + Math.atan2(y, x);

  return [toDegrees(φ2), ((toDegrees(λ2) + 540) % 360) - 180]; // normalise to −180..+180°
}

function getPerp(X1, Y1, X2, Y2, X3, Y3) {
  /************************************************************************************************ 
	Purpose - X1,Y1,X2,Y2 = Two points representing the ends of the line segment
	          X3,Y3 = The offset point 
	'Returns - X4,Y4 = Returns the Point on the line perpendicular to the offset or None if no such
	                    point exists
	************************************************************************************************/
  let XX = X2 - X1;
  let YY = Y2 - Y1;
  let shortestLength = (XX * (X3 - X1) + YY * (Y3 - Y1)) / (XX * XX + YY * YY);
  let X4 = X1 + XX * shortestLength;
  let Y4 = Y1 + YY * shortestLength;
  if (X4 < X2 && X4 > X1 && Y4 < Y2 && Y4 > Y1) {
    return [X4, Y4, shortestLength];
  }
  return "None";
}

function distanceLineInfinite(px, py, x1, y1, x2, y2) {
  /************************************************************************************************ 
	 //compute distance to (infinite) line (https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points)
	************************************************************************************************/
  let len = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
  if (Math.abs(len) < 0) return 0;
  let distToLine =
    ((y2 - y1) * px - (x2 - x1) * py + (x2 * y1 - y2 * x1)) / len;
  return [0, 0, distToLine];
}
