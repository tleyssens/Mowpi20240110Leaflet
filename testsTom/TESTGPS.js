let TestGpsDebug = require("debug")("tom:TestGps");
let mf = require("./mf.json");
let TomGps = require("../lib/TomGPS");S
const constants = require("../lib/constants");
let Gps = new TomGps();
//Gps.Gps(mf)
TestGpsDebug(Gps);
/*for(let i = 0; i < 11; i++) {
	console.log(i)
	//Gps.DoSteerAngleCalc()
	TestGpsDebug(Gps)
}*/
console.log(constants.PIBy2);
