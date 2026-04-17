var s = require('../bin/settings.json') //laad json-data uit bestand
var mower // ==> geen risico op motoraansturing (zie ook socketAPI)
//var mower = require('../lib/Mower')

//cc:touchbesturing#4; Steering doorgeven naar steeringMath
exports.KeyReceived = function (data) {
	//console.log('in KeyReceived');
	//console.log(data);
	switch (data.Key) {
		case "Steering":
			var X = parseFloat(data.steer);
      		var Y = parseFloat(data.speed);
      		steeringMath(X, Y);
			break;
		case "clickTarget":
			s.pos.target.lat = data.value.latLng.lat;
			s.pos.target.lon = data.value.latLng.lng;
			//traject.push(data.value.latLng);
			//io.emit('log', 'punt toegevoegd aan traject: ' + JSON.stringify(traject, null, 4));
			break;
		case "Pvalue":
			console.log('Pvalue = ' + JSON.stringify(data, null, 4));
			s.ctr.k_p = data.value;
			break;
		case "Ivalue":
			console.log('Ivalue = ' + JSON.stringify(data, null, 4));
			s.ctr.k_i = data.value;
			break;
		case "Dvalue":
			console.log('Dvalue = ' + JSON.stringify(data, null, 4));
			s.ctr.k_d = data.value;
			break;  
		case "pureValue":
      		console.log("pureValue = " + JSON.stringify(data, null, 4))
      		s.ABLine.mf.vehicle.goalPointLookAhead = data.value
      		break; 
	}
}
//cc:touchbesturing#5; Motorsnelheden bepalen 
function steeringMath(X, Y) { //sturen met touchscreen
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
  console.log('in socketFunc steeringMath X:%s, Y:%s, LM:%s, RM:%s', X, Y, LM.toFixed(0), RM.toFixed(0));
  //io.emit('Mot', Mot);
  if (s.driveEnable) {
    //max snelheid instellen
    // s.GUI.LM = map_range(LM, 250, -250, 255, -255)
		// s.GUI.RM = map_range(RM, 250, -250, 255, -255)
		s.GUI.LM = addDeadZone(LM)
		s.GUI.RM = addDeadZone(RM)
    mower.drive(s.GUI.LM,s.GUI.RM)
  } else {
    mower.stop()   
  };
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
function addDeadZone(value) {  //middengebied touch minder gevoelig maken
	if(Math.abs(value)<20) {
		value = 0
	} else {
		value = Math.sign(value) * map_range(Math.abs(value), 20 , 250, 0, 255).toFixed(0)
	}
	return value
}