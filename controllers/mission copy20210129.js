"use strict"
var s = require('../bin/settings.json'),
		GeographicLib = require("geographiclib"),
		geod = GeographicLib.Geodesic.WGS84,
		positions = [],
		traject = [],
		targets = [],
		targetHeading = 0,
  	targetDistance = 0,
		minDistance = 0.1, //meter
		n = 1,
		GPS = require('gps'),
		latLng1 = {
			lat: null,
			lng: null,
		},
		latlng = [],
		prev = {
			lat: null,
			lon: null
		},
		prevTrajectLat = 0,
		prevTrajectLon = 0,
		trajectLat = 0,
		trajectLon = 0,
		trajectDistance = 0,
		target = {
			lat: null,
			lon: null,
			n: null
		},
		targetLat = 0,
		targetLon = 0,
		pathSection = [],
		missionPath = []

exports.update = function (gps, socketList) {
	/*Object.entries(s).forEach(
    ([key, value]) => console.log(key, value)
	);*/
	switch (s.mission.data.MissionPlan.State) {
		case 0 : //setup = traject inlezen, startpunt MowArea toevoegen, tijd wachten om RTK te laten stabiel worden
			traject = s.mission.data.MissionPlan.MowArea.contour
			s.mission.log += ('||traject = ' + JSON.stringify(traject, null, 4));
			traject.unshift(s.mission.data.MissionPlan.MowArea.start)//startpunt mowarea toevoegen aan begin traject
			s.mission.data.MissionPlan.MowArea.start.lon = s.mission.data.MissionPlan.MowArea.start.lng
			s.mission.data.MissionPlan.MowArea.start.n = "MowAreaStart"
			socketList.emit('target', s.mission.data.MissionPlan.MowArea.start)
			setTimeout(timeout, 100, 'Tijd Om')// // wacht tot RTK beetje stabiel is en roept functie timeout aan onderaan
			s.mission.data.MissionPlan.State = 1
			break
		case 5: // 
			console.log('in case 5')
			latLng1.lat = gps.position.pos[0] //Huidige positie opslaan
			latLng1.lng = gps.position.pos[1]
			latLng1.lon = gps.position.pos[1]
			latLng1.n = "huidige positie"
			socketList.emit('target', latLng1)
			s.mission.log += ('||Huidige positie = ' + JSON.stringify(latLng1, null, 4))
			traject.unshift(latLng1) // Voeg huidig punt toe vooraan in array [0]=huidig [1]=A, [2]=B
			s.mission.log += ('||traject met huidige positie + startpunt MowArea + contour = ' + JSON.stringify(traject, null, 4));
			prevTrajectLat = traject[0].lat
			prevTrajectLon = traject[0].lng
			trajectLat = traject[1].lat
			trajectLon = traject[1].lng
			trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter 
			s.mission.log += ('||trajectDistance = ' + trajectDistance)
			target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 8 / trajectDistance); //eerste punt ligt 0,8m verder
			targets.push(target)
			target.n = targets.length
			s.mission.target = target
			socketList.emit('target', target)
			targetLat = target.lat
			targetLon = target.lon
			console.log(JSON.stringify(s.mission.log, null, 4))

			s.mission.data.MissionPlan.State = 10

			s.pos.prev.lat = s.data.position.pos[0]
			s.pos.prev.lon = s.data.position.pos[1]
			break
		case 10:
			console.log('in case 10')
	
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
        } else { console.log('s.pos.prev.lat gelijk aan s.data.prev.lon')}
			}
			targetDistance = 1000 * GPS.Distance(gps.position.pos[0], gps.position.pos[1], targetLat, targetLon) //in meter
			
			if (targetDistance < (minDistance * 6)) {//was 3
        // bijna aan target
        trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon) //in meter
        if (trajectDistance < (minDistance * 8)) { // was 15
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
          target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 8 / trajectDistance); //was 3
					//socketList.emit('target', target)//werkt niet?
					//io.emit('log', 'target1' + JSON.stringify(target, null, 4));
          targetLat = target.lat;
          targetLon = target.lon;
        } else { //we zijn nog ver van trajectpunt weg dus bereken een tussenpunt
          prevTrajectLat = targetLat;
          prevTrajectLon = targetLon;
          target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 10 / trajectDistance); //was 4
					//socketList.emit('target', target)
					//io.emit('log', 'target2 '+ n + ' prev= '+ prevTrajectLat + ', ' + prevTrajectLon +' nieuw='+ trajectLat + ', ' + trajectLon + ' minDistance '+ minDistance +' trajectDistance =' + trajectDistance);    
          targetLat = target.lat
          targetLon = target.lon
          //io.emit('log', 'target2' + JSON.stringify(target, null, 4));
        };
        if (target.lat !== null) {
          //io.emit('log', target.lat)
          targets.push(target)
          target.n = targets.length
					socketList.emit('target', target)
				}
			}
			s.targetHeading = GPS.Heading(gps.position.pos[0], gps.position.pos[1], targetLat, targetLon); //geeft een waarde van 0 tot 360 graden
			console.log('targetHead ==> %s', s.targetHeading)
			if (s.targetHeading > 180) s.targetHeading -= 360;
			if (s.targetHeading < -180) s.targetHeading += 360;
			s.angleError = s.targetHeading - gps.state.bearing;
			if (s.angleError > 180) s.angleError -= 360;
			if (s.angleError < -180) s.angleError += 360;
			//	console.log('gps = ' + JSON.stringify(gps, null, 4));
			console.log('=> targetHeading = %s, => angleError = %s, => bearing = %s ', s.targetHeading, s.angleError, gps.state.bearing)
			break
		case 100: // 1 sectie berekenen
			console.log('case 100')
			traject = s.mission.data.MissionPlan.MowArea.contour
			let wp_14 = waypoints(traject[0][0],traject[0][1],traject[3][0],traject[3][1])
			//console.log('wp14 :' + JSON.stringify(wp_14, null, 4))
			let wp_23 = waypoints(traject[1][0],traject[1][1],traject[2][0],traject[2][1])
			pathSection = path(wp_14,wp_23)
			console.log('path van 1 sectie berekend')
			console.log(pathSection)
			s.mission.data.MissionPlan.State = 101
			setTimeout(timeout2, 1000, 'Wachttijd RTK Om')
			break
		case 101:
			console.log('case 101')
			s.mission.data.MissionPlan.State = 102
			break
		case 102:// secties samenvoegen
		  console.log('case 102')
			missionPath.push(pathSection)
			socketList.emit('missionPath', missionPath[0])
			break
		case 103:
			console.log('case 103')
			traject = pathSection
			//s.mission.log += ('||traject103 = ' + traject)//JSON.stringify(traject, null, 4));
			traject.unshift(s.mission.data.MissionPlan.MowArea.start)//startpunt mowarea toevoegen aan begin traject
			s.mission.data.MissionPlan.MowArea.start.n = "MowAreaStart"
			socketList.emit('targetA', s.mission.data.MissionPlan.MowArea.start)
			s.mission.data.MissionPlan.State = 105
			break
		case 105:
			console.log('in case 105')
			//Huidige positie opslaan
			latlng[0] = gps.position.pos[0]
			latlng[1] = gps.position.pos[1]
			latlng[2] = "huidige positie"
			socketList.emit('targetA', latlng)
			s.mission.log += ('||Huidige positie = ' + latlng)
			traject.unshift(latlng) // Voeg huidig punt toe vooraan in array [0]=huidig [1]=A, [2]=B
			s.mission.log += ('||traject met huidige positie + startpunt MowArea + contour = ' + traject)//JSON.stringify(traject, null, 4));
			prevTrajectLat = traject[0][0]
			prevTrajectLon = traject[0][1]
			trajectLat = traject[1][0]
			trajectLon = traject[1][1]
			trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter 
			s.mission.log += ('||trajectDistance = ' + trajectDistance)
			target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 8 / trajectDistance); //eerste punt ligt 0,8m verder
			targets.push(target)
			target.n = targets.length
			s.mission.target = target
			s.mission.log += ('||target = ' + JSON.stringify(target, null, 4)) 
			socketList.emit('target', target)
			targetLat = target.lat
			targetLon = target.lon
			console.log(JSON.stringify(s.mission.log, null, 4))
			s.mission.data.MissionPlan.State = 110
			s.pos.prev.lat = s.data.position.pos[0]
			s.pos.prev.lon = s.data.position.pos[1]
			break
		case 110:
			console.log('case 110')
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
        } else { console.log('s.pos.prev.lat gelijk aan s.data.prev.lon')}
			}
			targetDistance = 1000 * GPS.Distance(gps.position.pos[0], gps.position.pos[1], targetLat, targetLon) //in meter
			
			if (targetDistance < (minDistance * 6)) {//was 3
        // bijna aan target
        trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon) //in meter
        if (trajectDistance < (minDistance * 8)) { // was 15
          // bijna aan trajectpunt => neem het volgende trajectpunt. Als aan laatste punt, rij terug naar het eerste
          if (n <= traject.length) {
            n++;
          } else {
            n = 1;
          };
          //io.emit('log', 'traject['+n+'].lat = ' + traject[n].lat );
          prevTrajectLat = trajectLat;
          prevTrajectLon = trajectLon;
          trajectLat = traject[n][0]//.lat;
          trajectLon = traject[n][1]//.lng;

          trajectDistance = 1000 * GPS.Distance(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon); //in meter
          if (trajectDistance == 0) {
            s.autoMow = 0;
            return
          }
          //io.emit('log', 'traject '+ n + ' prev= '+ prevTrajectLat + ', ' + prevTrajectLon +' nieuw='+ trajectLat + ', ' + trajectLon + ' minDistance '+ minDistance +' trajectDistance =' + trajectDistance);
          target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 8 / trajectDistance); //was 3
					//socketList.emit('target', target)//werkt niet?
					//io.emit('log', 'target1' + JSON.stringify(target, null, 4));
          targetLat = target.lat;
          targetLon = target.lon;
        } else { //we zijn nog ver van trajectpunt weg dus bereken een tussenpunt
          prevTrajectLat = targetLat;
          prevTrajectLon = targetLon;
          target = GPS.intermediatePoint(prevTrajectLat, prevTrajectLon, trajectLat, trajectLon, minDistance * 10 / trajectDistance); //was 4
					//socketList.emit('target', target)
					//io.emit('log', 'target2 '+ n + ' prev= '+ prevTrajectLat + ', ' + prevTrajectLon +' nieuw='+ trajectLat + ', ' + trajectLon + ' minDistance '+ minDistance +' trajectDistance =' + trajectDistance);    
          targetLat = target.lat
          targetLon = target.lon
          //io.emit('log', 'target2' + JSON.stringify(target, null, 4));
        };
        if (target.lat !== null) {
          //io.emit('log', target.lat)
          targets.push(target)
          target.n = targets.length
					socketList.emit('target', target)
				}
			}
			s.targetHeading = GPS.Heading(gps.position.pos[0], gps.position.pos[1], targetLat, targetLon); //geeft een waarde van 0 tot 360 graden
			console.log('targetHead ==> %s', s.targetHeading)
			if (s.targetHeading > 180) s.targetHeading -= 360;
			if (s.targetHeading < -180) s.targetHeading += 360;
			s.angleError = s.targetHeading - gps.state.bearing;
			if (s.angleError > 180) s.angleError -= 360;
			if (s.angleError < -180) s.angleError += 360;
			//	console.log('gps = ' + JSON.stringify(gps, null, 4));
			console.log('=> targetHeading = %s, => angleError = %s, => bearing = %s ', s.targetHeading, s.angleError, gps.state.bearing)



			break


	}	
}
function timeout(arg) { // wacht to RTK beetje stabiel is
	console.log(`arg was => ${arg}`)
	s.mission.data.MissionPlan.State = 5 //was 5
}
function timeout2(arg) { // wacht to RTK beetje stabiel is
	console.log(`arg was => ${arg}`)
	s.mission.data.MissionPlan.State = 103 //was 5
}
function waypoints(lat1,lon1,lat2,lon2) {
	let wp = []
	let ds = 1 //is the distance between waypoints which correspond to blade width We use 1 meter as the blade is 110cm.
	let l = geod.InverseLine(lat1, lon1, lat2, lon2)
	//console.log('l = ', l)
	let n = Math.round(Math.ceil(l.s13 / ds))
	//console.log('n = ', n)
	for (let i=0; i<n+1 ; i++){// in range(n+1):
			if (i === 0) {
					//console.log("distance latitude longitude")
			}
			let s = Math.min(ds * i, l.s13)
			//console.log('s = ', s)
			let g = l.Position(s, GeographicLib.Geodesic.STANDARD | GeographicLib.Geodesic.LONG_UNROLL)
			wp.push([g['lat2'], g['lon2']])
			//console.log('%s %s %s',g['s12'].toFixed(0), g['lat2'].toFixed(6), g['lon2'].toFixed(6))
			//console.log(wp)
	}
	return wp
}

function path(wp14, wp23) {
	//console.log('Navigation path coordinates: ')
	let count14 = 0,
			count23 = 0,
			is14 = true,
			pathList = []
  //console.log('wp lengths 1-4 : %s, 2-3 : %s , min : %s', wp14.length , wp23.length, Math.min(wp14.length, wp23.length))
	for (let i=0; i<Math.min(wp14.length, wp23.length)-1;i++) {
	    if (is14) {
        if (count14 != 0) {
            pathList.push(wp14[count14])
            //console.log('WP14-%s  %s , %s', count14, wp14[count14][0], wp14[count14][1])
						count14 += 1
				}
        pathList.push(wp14[count14])
        //console.log('WP14-%s  %s , %s', count14, wp14[count14][0], wp14[count14][1])
        count14 += 1
				is14 = false
		}
    else {
            pathList.push(wp23[count23])
            //console.log('WP23-%s  %s , %s', count23, wp23[count23][0], wp23[count23][1])
            count23 +=1
            pathList.push(wp23[count23])
            //console.log('WP23-%s  %s , %s', count23, wp23[count23][0], wp23[count23][1])
            count23 +=1
						is14 = true
		}
		//console.log('i: %s, count14: %s, count23: %s', i, count14, count23)
	}
	return pathList
}