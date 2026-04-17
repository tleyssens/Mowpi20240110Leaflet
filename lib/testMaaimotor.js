var Gpio = require('pigpio').Gpio
const MES2 = new Gpio(25, {
	mode: Gpio.OUTPUT
})
console.log(Object.getOwnPropertyNames(MES2))
MES2.servoWrite(1000);
setTimeout(function () { //mes2 starten na 0,5 sec
	MES2.servoWrite(1500); //1000 tot 2000 is de draaisnelheid van het mes
}, 5000);
setTimeout(function () { //mes2 starten na 0,5 sec
	MES2.servoWrite(1000); //1000 tot 2000 is de draaisnelheid van het mes
}, 10000);

