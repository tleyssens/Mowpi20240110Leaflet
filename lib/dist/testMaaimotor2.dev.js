"use strict";

var rpio = require('rpio');

rpio.init({
  mapping: 'gpio',
  gpiomem: false
});
var MES2 = 25;
rpio.open(MES2, rpio.PWM);
rpio.pwmSetRange(MES2, 20000); // 20ms periode

rpio.pwmSetClockDivider(MES2, 192); // ~50Hz

console.log('Servo test gestart op GPIO', MES2);
rpio.pwmWrite(MES2, 1200); // ~1000us (stop)

setTimeout(function () {
  rpio.pwmWrite(MES2, 1800); // ~1500us

  console.log('Servo op 1500');
}, 5000);
setTimeout(function () {
  rpio.pwmWrite(MES2, 1200); // terug naar stop

  console.log('Servo terug naar 1000');
}, 7000);