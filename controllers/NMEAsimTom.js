let debugNMEAsimTom = require('debug')('tom:NMEAsimTom')
const Readable = require('stream').Readable
//var util = require('util')
var s = require('../bin/settings.json')

class NMEA {
	constructor() {
		this.fixQuality = 4
		this.sats = 16
		this.HDOP = 0.7
		this.altitude = 48.887
		var		EW = 'W'
		,		NS = 'N'
		this.speed = 0.6
		this.stepDistance = 0.00001
		this.stepDistanceOud = 0.2
 		var sbGGA =  ""
		this.headingTrue = s.start1.richting * Math.PI/180  //rad
		var latNMEA
		var Properties = { 
					Settings : {
						Default : {
							setGPS_Latitude : s.start1.lat,
							setGPS_Longitude : s.start1.lng,
						}
					}
				}
		var threeSecondCounter = 0, threeSeconds = 0,
					oneSecondCounter = 0, oneSecond = 0,
					oneHalfSecondCounter = 0, oneHalfSecond = 0,
					displayUpdateHalfSecondCounter = 0
		this.latitude = Properties.Settings.Default.setGPS_Latitude
		this.longitude = Properties.Settings.Default.setGPS_Longitude
		this.steerangle = 0
	}
	DoSimTick(_st) {
		let steerAngle = _st;
		let temp = (this.stepDistance * Math.tan(steerAngle * 0.0165329252) / 3.3);
		this.headingTrue += temp;
		if (this.headingTrue > (2.0 * Math.PI)) this.headingTrue -= (2.0 * Math.PI);
		if (this.headingTrue < 0) this.headingTrue += (2.0 * Math.PI);
		
		let degrees = this.headingTrue * 57.2958;//van rad naar degrees
		degrees = Math.round(degrees, 1);
		
		//Calculate the next Lat Long based on heading and distance
		const {latitude, longitude, latNMEA,longNMEA,NS,EW} = CalculateNewPostionFromBearingDistance(this.latitude, this.longitude, degrees, this.stepDistance / 1000.0);
	  debugNMEAsimTom(`48 steerAngle= ${steerAngle} latNMEA= ${latNMEA} longNMEA= ${longNMEA} deg ${degrees} stepDistance ${this.stepDistance} temp= ${temp}`) 
		this.latitude = latitude
		this.longitude = longitude
		this.speed = Math.round(1.944 * this.stepDistance * 5.0, 1);
		//console.log('speed : ' + this.speed)
		
		let sbSendText = BuildGGA(latNMEA,longNMEA,NS,EW,this.fixQuality, this.sats, this.HDOP , this.altitude)
		return sbSendText
	}

	DoSimTickHead(_head) {
		
		headingTrue = _head;
		if (headingTrue > (2.0 * Math.PI)) headingTrue -= (2.0 * Math.PI);
		if (headingTrue < 0) headingTrue += (2.0 * Math.PI);
		
		degrees = headingTrue * 57.2958;//van rad naar degrees
		degrees = Math.round(degrees, 1);
		
		//Calculate the next Lat Long based on heading and distance
		CalculateNewPostionFromBearingDistance(latitude, longitude, degrees, stepDistance / 1000.0);//doet dit iets
	
		speed = Math.round(1.944 * stepDistance * 5.0, 1);
		debugNMEAsimTom('DoSimTickHead:speed : ' + speed)
		
		let sbSendText = BuildGGA()
		return sbSendText
	}

	generateLine() {
		return "$GGA" + new Date()
	}
}

class NMEAstream extends Readable {
	constructor(time) {
		super(nmea)
		this.nmea = nmea	
		this.time = time
	}
	_read() {
		let that = this
		setTimeout(function() {that.getLine()},that.time)
	}
	getLine() {
		this.push(this.nmea.DoSimTick(this.nmea.steerangle))//+'\r\n')//
	}
}

function CalculateNewPostionFromBearingDistance( lat,  lng,  bearing,  distance) {
	//console.log(this.lat)
	const  R = 6371; // Earth Radius in Km
	const pi180 = Math.PI / 180

	lat2 = Math.asin((Math.sin(pi180 * lat) * Math.cos(distance / R))
			+ (Math.cos(pi180 * lat) * Math.sin(distance / R) * Math.cos(pi180 * bearing)));
	lon2 = (pi180 * lng) + Math.atan2(Math.sin(pi180 * bearing) * Math.sin(distance / R)
			* Math.cos(pi180 * lat), Math.cos(distance / R) - (Math.sin(pi180 * lat) * Math.sin(lat2)));
	//console.log ('lat2 = ' + lat2 + "  |  " + 'lon2 = ' + lon2)
	
	latitude = 180 / Math.PI * lat2;
	longitude = 180 / Math.PI * lon2;
	//console.log ('latitude = ' + latitude + "  |  " + 'longitude = ' + longitude)

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
	longNMEA = longMinu + longDeg;
	//console.log('longNMEA : ' + longNMEA)
	if (latitude >= 0) NS = 'N';
	else NS = 'S';
	if (longitude >= 0) EW = 'E';
	else EW = 'W';
	//console.log(latNMEA + "," + longNMEA)
	return { latitude, longitude, latNMEA, longNMEA, NS, EW }
}
function BuildGGA(latNMEA, longNMEA, NS, EW, fixQuality, sats, HDOP, altitude) {
	//let now = new Date()
	sbGGA = ""
	sbGGA = "$GPGGA,"
	
	sbGGA = sbGGA.concat(getTime(true) + ',')//Tom was + '.00,'
	sbGGA = sbGGA.concat(Math.abs(latNMEA) + ',' + NS + ',')
	sbGGA = sbGGA.concat('00' + Math.abs(longNMEA) + ',' + EW + ',')
	sbGGA = sbGGA.concat(fixQuality + ',' + sats + ',' + HDOP + ',' + altitude)
	sbGGA = sbGGA.concat(',M,45.800,M,,0000*')
	let sumStr = CalculateChecksum(sbGGA)
	sbGGA = sbGGA.concat(sumStr)
	sbGGA = sbGGA.concat('\r\n')
	return sbGGA
}
function BuildSTI32() {
	//let now = new Date()
	sbSTI32 = ""
	sbSTI32 = "$GPSTI,032,"
	sbSTI32 = sbSTI32.concat(getTime(true) + ',')
	sbSTI32 = sbSTI32.concat("A,R,")


	
	//nog niet af
	let sumStr = CalculateChecksum(sbSTI32) 
	sbSTI32 = sbSTI32.concat(sumStr)
	sbSTI32 = sbSTI32.concat('\r\n')
	return sbSTI32
}
function getTime(full) {
	var today = new Date(),
			h = addZero(today.getHours(),2),
			m = addZero(today.getMinutes(),2),
			s = addZero(today.getSeconds(),2),
			ms = addZero(today.getMilliseconds(),3);
	if (full === true) { return "" + h + m + s + "." + ms }
	else {
		let dd = addZero(today.getDate(),2),
			mm = addZero(today.getMonth(),2),
			yy = addZero(today.getFullYear(),2)
		return "" + h + m + s + "." + ms + "," + dd + mm + yy
	}
}
function addZero(x,n) {
	while (x.toString().length < n) {
		x = "0" + x;
	}
	return x;
}
function CalculateChecksum(cmd)
{
  // Compute the checksum by XORing all the character values in the string.
  var checksum = 0;
  for(var i = 1; i < cmd.length-1; i++) {
    checksum = checksum ^ cmd.charCodeAt(i);
  }

  // Convert it to hexadecimal (base-16, upper case, most significant nybble first).
  var hexsum = Number(checksum).toString(16).toUpperCase();
  if (hexsum.length < 2) {
    hexsum = ("00" + hexsum).slice(-2);
  }
  
  // Display the result
	//console.log("$" + cmd + "*" + hexsum);
	return hexsum
}

nmea = new NMEA()
//console.log(util.inspect(nmea, true, 3, true))
debugNMEAsimTom("212 NMEASimTom.js module geladen")
module.exports = NMEAstream