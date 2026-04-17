"use strict";

var TomGPS = require("gps"); //uitbreiding van gps.js


var debugTomGPS = require("debug")("tom3:TomGPS");

var mPerDegreeLat = 0;
var mPerDegreeLon = 0;
var R2D = 180 / Math.PI; //Propertie NDA toevoegen aan bestaande module als kopie van GGA

TomGPS.GPS['mod'].NDA = TomGPS.GPS['mod'].GGA;

TomGPS.AverageTheSpeed = function (avgSpeed, speed) {
  //average the speed
  if (speed > 70) speed = 70;
  return avgSpeed = avgSpeed * 0.75 + speed * 0.25;
};

TomGPS.SetLocalMetersPerDegree = function (latStart) {
  debugTomGPS("TomGPS.js:14 SetLocalMetersPerDegrees");
  mPerDegreeLat = 111132.92 - 559.82 * Math.cos(2.0 * latStart * 0.01745329251994329576923690766743) + 1.175 * Math.cos(4.0 * latStart * 0.01745329251994329576923690766743) - 0.0023 * Math.cos(6.0 * latStart * 0.01745329251994329576923690766743);
  mPerDegreeLon = 111412.84 * Math.cos(latStart * 0.01745329251994329576923690766743) - 93.5 * Math.cos(3.0 * latStart * 0.01745329251994329576923690766743) + 0.118 * Math.cos(5.0 * latStart * 0.01745329251994329576923690766743);
  debugTomGPS("mPerDegreeLat, lon : %s,%s", mPerDegreeLat, mPerDegreeLon); //ConvertWGS84ToLocal(latitude, longitude);
  //mf.worldGrid.checkZoomWorldGrid(northing, easting);
};

TomGPS.ConvertLocalToWGS84 = function (latStart, lonStart, Easting, Northing) {
  // debugTomGPS('ConvertLocalToWGS84 %s, %s, %s',latStart, lonStart, mPerDegreeLat)
  var Lat = Northing / mPerDegreeLat + latStart;
  mPerDegreeLon = 111412.84 * Math.cos(Lat * 0.01745329251994329576923690766743) - 93.5 * Math.cos(3.0 * Lat * 0.01745329251994329576923690766743) + 0.118 * Math.cos(5.0 * Lat * 0.01745329251994329576923690766743);
  var Lon = Easting / mPerDegreeLon + lonStart;
  return [Lat, Lon];
};

TomGPS.ConvertWGS84ToLocal = function (Lat, Lon, latStart, lonStart) {
  // debugTomGPS(
  //   "Lat %s, Lon %s, latStart %s, lonStart %s",
  //   Lat,    Lon,    latStart,    lonStart
  // );
  mPerDegreeLon = 111412.84 * Math.cos(Lat * 0.01745329251994329576923690766743) - 93.5 * Math.cos(3.0 * Lat * 0.01745329251994329576923690766743) + 0.118 * Math.cos(5.0 * Lat * 0.01745329251994329576923690766743); // debugTomGPS(
  //   "mPerDegreeLat %s, mPerDegreeLon %s, Lat %s, LatStart %s",
  //   mPerDegreeLat,
  //   mPerDegreeLon,
  //   Lat,
  //   latStart
  // );

  var Northing = (Lat - latStart) * mPerDegreeLat;
  var Easting = (Lon - lonStart) * mPerDegreeLon;
  debugTomGPS("63 Northing = %s ;  Easting = %s", Northing, Easting); // Northing += mf.RandomNumber(-0.02, 0.02);
  // Easting += mf.RandomNumber(-0.02, 0.02);
  // console.log('northin %s, easting %s', Northing, Easting)

  return {
    northing: Northing,
    easting: Easting
  };
};

TomGPS.GetLocalToWSG84_KML = function (Easting, Northing) {
  Lat = Northing / mPerDegreeLat + latStart;
  mPerDegreeLon = 111412.84 * Math.cos(Lat * 0.01745329251994329576923690766743) - 93.5 * Math.cos(3.0 * Lat * 0.01745329251994329576923690766743) + 0.118 * Math.cos(5.0 * Lat * 0.01745329251994329576923690766743);
  Lon = Easting / mPerDegreeLon + lonStart;
  return Lon.ToString("N7", CultureInfo.InvariantCulture) + "," + Lat.ToString("N7", CultureInfo.InvariantCulture) + ",0 ";
};

TomGPS.DistanceNE = function (pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.easting - pos2.easting, 2) + Math.pow(pos1.northing - pos2.northing, 2));
};

TomGPS.toDegrees = function (radians) {
  return radians * 57.295779513082325225835265587528;
};

TomGPS.toRadians = function (degrees) {
  return degrees * 0.01745329251994329576923690766743;
};

TomGPS.DistanceSquared4 = function (northing1, easting1, northing2, easting2) {
  //debugTomGPS("in DistanceSquared %s, %s, %s, %s", northing1, easting1, northing2, easting2)
  return Math.pow(easting1 - easting2, 2) + Math.pow(northing1 - northing2, 2);
};

TomGPS.DistanceSquared2 = function (first, second) {
  return Math.pow(first.easting - second.easting, 2) + Math.pow(first.northing - second.northing, 2);
};
/**
		 * Returns the point at given fraction between ‘this’ point and specified point.
		 *				https://www.movable-type.co.uk/scripts/latlong.html
		 * @param   {LatLon} point - Latitude/longitude of destination point.
		 * @param   {number} fraction - Fraction between the two points (0 = this point, 1 = specified point).
		 * @returns {LatLon} Intermediate point between this point and destination point.
		 *
		 * @example
		 *   let p1 = new LatLon(52.205, 0.119);
		 *   let p2 = new LatLon(48.857, 2.351);
		 *   let pMid = p1.intermediatePointTo(p2, 0.25); // 51.3721°N, 000.7073°E
		 */


TomGPS.intermediatePoint = function (lat1, lon1, lat2, lon2, fraction) {
  var φ1 = lat1 * D2R,
      λ1 = lon1 * D2R;
  var φ2 = lat2 * D2R,
      λ2 = lon2 * D2R;
  var sinφ1 = Math.sin(φ1),
      cosφ1 = Math.cos(φ1),
      sinλ1 = Math.sin(λ1),
      cosλ1 = Math.cos(λ1);
  var sinφ2 = Math.sin(φ2),
      cosφ2 = Math.cos(φ2),
      sinλ2 = Math.sin(λ2),
      cosλ2 = Math.cos(λ2); // distance between points

  var Δφ = φ2 - φ1;
  var Δλ = λ2 - λ1;
  var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var A = Math.sin((1 - fraction) * δ) / Math.sin(δ);
  var B = Math.sin(fraction * δ) / Math.sin(δ);
  var x = A * cosφ1 * cosλ1 + B * cosφ2 * cosλ2;
  var y = A * cosφ1 * sinλ1 + B * cosφ2 * sinλ2;
  var z = A * sinφ1 + B * sinφ2;
  var φ3 = Math.atan2(z, Math.sqrt(x * x + y * y));
  var λ3 = Math.atan2(y, x);
  return new LatLon(φ3 * R2D, (λ3 * R2D + 540) % 360 - 180); // normalise lon to −180..+180°
};
/**
      * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
      *
      * @constructor
      * @param {number} lat - Latitude in degrees.
      * @param {number} lon - Longitude in degrees.
      *
      * @example
      *     var p1 = new LatLon(52.205, 0.119);
*/


TomGPS.LatLon = function (lat, lon) {
  // allow instantiation without 'new'
  if (!(this instanceof LatLon)) return new LatLon(lat, lon);
  this.lat = Number(lat);
  this.lon = Number(lon);
}; //debugTomGPS(Object.getOwnPropertyNames(TomGPS.prototype))


module.exports = TomGPS; //staat al in gps.js, maar denk dat dat origineel er niet instaat...
// /**
// 		 * Returns the point at given fraction between ‘this’ point and specified point.
// 		 *				https://www.movable-type.co.uk/scripts/latlong.html
// 		 * @param   {LatLon} point - Latitude/longitude of destination point.
// 		 * @param   {number} fraction - Fraction between the two points (0 = this point, 1 = specified point).
// 		 * @returns {LatLon} Intermediate point between this point and destination point.
// 		 *
// 		 * @example
// 		 *   let p1 = new LatLon(52.205, 0.119);
// 		 *   let p2 = new LatLon(48.857, 2.351);
// 		 *   let pMid = p1.intermediatePointTo(p2, 0.25); // 51.3721°N, 000.7073°E
// 		 */
// 		 GPS['intermediatePoint'] = function(lat1, lon1, lat2, lon2, fraction) {
// 			var φ1 = lat1 * D2R, λ1 = lon1 * D2R;
// 			var φ2 = lat2 * D2R, λ2 = lon2 * D2R;
// 			var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), sinλ1 = Math.sin(λ1), cosλ1 = Math.cos(λ1);
// 			var sinφ2 = Math.sin(φ2), cosφ2 = Math.cos(φ2), sinλ2 = Math.sin(λ2), cosλ2 = Math.cos(λ2);
// 			// distance between points
// 			var Δφ = φ2 - φ1;
// 			var Δλ = λ2 - λ1;
// 			var a = Math.sin(Δφ/2) * Math.sin(Δφ/2)
// 				+ Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
// 			var δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
// 			var A = Math.sin((1-fraction)*δ) / Math.sin(δ);
// 			var B = Math.sin(fraction*δ) / Math.sin(δ);
// 			var x = A * cosφ1 * cosλ1 + B * cosφ2 * cosλ2;
// 			var y = A * cosφ1 * sinλ1 + B * cosφ2 * sinλ2;
// 			var z = A * sinφ1 + B * sinφ2;
// 			var φ3 = Math.atan2(z, Math.sqrt(x*x + y*y));
// 			var λ3 = Math.atan2(y, x);
// 			return new LatLon(φ3 * R2D, (λ3 * R2D + 540)%360-180); // normalise lon to −180..+180°
// 		};