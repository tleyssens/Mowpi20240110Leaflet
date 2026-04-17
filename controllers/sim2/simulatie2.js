//'use strict';
module.exports = function (sim) {
	const {
		exec
	} = require('child_process');
	const net = require('net');
	const client = new net.Socket();
	//const split = require('split');

	sim.prototype.streamStart = function (io, stepDistance) {
		console.log('in streamStart simulatie 2');
		var fixQuality = 5
		,		sats = 12
		,		HDOP = 0.9
		,		altitude = 319.1
		,		sumStr = ""
		,		EW = 'W'
		,		NS = 'N'
		, 	speed = 0.6
		//,		stepDistance = 0.2
		,		sbGGA =  ""
		,		headingTrue = 0
		,		latNMEA
		var Properties = { 
					Settings : {
						Default : {
							setGPS_Latitude : 53.4360564,
							setGPS_Longitude : -111.160047
						}
					}
				}
		var threeSecondCounter = 0, threeSeconds = 0,
				oneSecondCounter = 0, oneSecond = 0,
				oneHalfSecondCounter = 0, oneHalfSecond = 0,
				displayUpdateHalfSecondCounter = 0

		var latitude = Properties.Settings.Default.setGPS_Latitude;
		var longitude = Properties.Settings.Default.setGPS_Longitude;

		function DoSimTick(_st) {
			steerAngle = _st;
			temp = (stepDistance * Math.tan(steerAngle * 0.0165329252) / 3.3);
			headingTrue += temp;
			if (headingTrue > (2.0 * Math.PI)) headingTrue -= (2.0 * Math.PI);
			if (headingTrue < 0) headingTrue += (2.0 * Math.PI);
			
			degrees = headingTrue * 57.2958;//van rad naar degrees
			degrees = Math.round(degrees, 1);
			
			//Calculate the next Lat Long based on heading and distance
			CalculateNewPostionFromBearingDistance(latitude, longitude, degrees, stepDistance / 1000.0);

			speed = Math.round(1.944 * stepDistance * 5.0, 1);
			console.log('speed : ' + speed)
			
			
			let sbSendText = BuildGGA()
			return sbSendText
		}

		function checkTime(i) {
			return (i < 10) ? "0" + i : i;
		}

		function getTime() {
			var today = new Date(),
					h = checkTime(today.getHours()),
					m = checkTime(today.getMinutes()),
					s = checkTime(today.getSeconds());
			return "" + h + m + s;
		}

		function BuildGGA() {
			let now = new Date()
			sbGGA = ""
			sbGGA = "$GPGGA,"
			
			sbGGA = sbGGA.concat(getTime() + '.00,')
			sbGGA = sbGGA.concat(Math.abs(latNMEA) + ',' + NS + ',')
			sbGGA = sbGGA.concat(Math.abs(longNMEA) + ',' + EW + ',')
			sbGGA = sbGGA.concat(fixQuality + ',' + sats + ',' + HDOP + ',' + altitude)
			sbGGA = sbGGA.concat(',M,46.9,M,,,*')
			CalculateChecksum(sbGGA)
			sbGGA = sbGGA.concat(sumStr)
			sbGGA = sbGGA.concat('\r\n')
			return sbGGA
		}

		function CalculateNewPostionFromBearingDistance( lat,  lng,  bearing,  distance)
						{
								const  R = 6371; // Earth Radius in Km

								lat2 = Math.asin((Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R))
										+ (Math.cos(Math.PI / 180 * lat) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * bearing)));

								lon2 = (Math.PI / 180 * lng) + Math.atan2(Math.sin(Math.PI / 180 * bearing) * Math.sin(distance / R)
										* Math.cos(Math.PI / 180 * lat), Math.cos(distance / R) - (Math.sin(Math.PI / 180 * lat) * Math.sin(lat2)));
								latitude = 180 / Math.PI * lat2;
								longitude = 180 / Math.PI * lon2;
		console.log('lat : ' + lat + ' | lng : ' + lng + ' | bearing : ' + bearing + ' | distance : ' + distance + ' | lat2 : '+ lat2 + ' | lon2 : ' + lon2 + ' | latitude : ' + latitude + ' | longitude : ' + longitude)

								//convert to DMS from Degrees
								latMinu = latitude;
								longMinu = longitude;
								//console.log(latMinu)
								latDeg = Math.floor(latitude);
								longDeg = Math.floor(longitude);
								//console.log('latDeg : ' + latDeg)

								latMinu -= latDeg;
								longMinu -= longDeg;
								//console.log(latMinu)

								latMinu = +(latMinu * 60.0).toFixed(7)// + ervoor maakt van de string terug een getal
								longMinu = +(longMinu * 60.0).toFixed(7)

								latDeg *= 100.0;
								//console.log('latDeg : ' + latDeg)
								longDeg *= 100.0;

								latNMEA = latMinu + latDeg;
								//console.log('latNMEA : ' + latNMEA)
								longNMEA = longMinu + longDeg;

								if (latitude >= 0) NS = 'N';
								else NS = 'S';
								if (longitude >= 0) EW = 'E';
								else EW = 'W';
						}
		//calculate the NMEA checksum to stuff at the end
		function CalculateChecksum(Sentence)
		{
				let sum = 0, inx;
				//let sentence_chars[] = Sentence.split('')
				//convertion to array:
				let sentence_chars = [...Sentence];
				console.log('sentence_chars : ' + sentence_chars[0])
				let tmp = "";
				// All character xor:ed results in the trailing hex checksum
				// The checksum calc starts after '$' and ends before '*'
				for (inx = 1; ; inx++)
				{
						tmp = sentence_chars[inx];
						// Indicates end of data and start of checksum
						if (tmp == '*')
								break;
						sum ^= tmp;    // Build checksum
				}
				// Calculated checksum converted to a 2 digit hex string
				//sumStr = sum.toString(16);
				sumStr = ("0" + sum.toString(16)).substr(-16);
				console.log('sum : ' + sum + ' | sumStr' + sumStr)
		}

		//console.log ('GGA = ' + BuildGGA())
		//console.log('Prop' + Properties.Settings.Default.setGPS_Latitude)
		//if (oneHalfSecondCounter === 2) {
		//	console.log('doSimTick ' + DoSimTick(0))
		//}

		//Timer triggers at 50 msec, 20 hz, and is THE clock of the whole program//
		function tmrWatchdog_tick()
			{
					//go see if data ready for draw and position updates
					//ScanForNMEA();
					if (threeSecondCounter++ > 60)
					{
							threeSecondCounter = 0;
							threeSeconds++;
					}
					if (oneSecondCounter++ > 20)
					{
							oneSecondCounter = 0;
							oneSecond++;
							
					}
					if (oneHalfSecondCounter++ > 10)
					{
							oneHalfSecondCounter = 0;
							oneHalfSecond++;
					}
					if (displayUpdateHalfSecondCounter != oneHalfSecond)
					{
							//reset the counter
							displayUpdateHalfSecondCounter = oneHalfSecond;

							console.log('doSimTick ' + DoSimTick(0)) 
					}
				}
		var t = setInterval(function () {
			tmrWatchdog_tick()
		}, 50)
		console.log('sbGGA' + sbGGA)
		return sbGGA ;
	};
};

