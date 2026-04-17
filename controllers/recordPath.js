var s = require('../bin/settings.json'),
		GPS = require('gps')

exports.update = function (state) {
	if (s.contour.isRecordOn) {
		if (s.contour.prevPos.lat == 0) {
				s.contour.prevPos.lat = state.lat
				s.contour.prevPos.lng = state.lon
		}
		let contourDriveDistance = GPS.Distance(s.contour.prevPos.lat, s.contour.prevPos.lng, state.lat, state.lon) * 1000;
		
		console.log(s.contour.prevPos.lat + ',' + s.contour.prevPos.lng + '|' +  state.lat + ',' + state.lon)
				
		console.log('contourDriveDistance' + contourDriveDistance)
		// timer start
		//console.time('label1');
		if (contourDriveDistance > s.contour.TriggerDistance) {
				AddContourPathPoints(state)
				console.log("punt Toegevoegd")
		}
	}
}

function AddContourPathPoints(state) {
	s.contour.recList.push([state.lat, state.lon])
	s.contour.prevPos.lat = state.lat
	s.contour.prevPos.lng = state.lon
	console.log(JSON.stringify(s.contour.recList))
	console.log('aantal contourpunten = ' + s.contour.recList.length)
}