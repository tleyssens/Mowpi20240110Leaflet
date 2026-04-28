"use strict";

var rpio = require('rpio');

var TomMotor = function () {
  var PWM_RANGE = 255; // 0-255 zoals pigpio

  function Setup(enable, cw, ccw) {
    var minSpeed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 70;
    var maxSpeed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 255;
    this.enable = enable;
    this.cw = cw;
    this.ccw = ccw;
    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;
    this.Forward = true;
    this.ramping = false;
    this.speed = 0;
    this.targetSpeed = 0;
    this.interval = null; // Init pins

    rpio.open(enable, rpio.PWM);
    rpio.open(cw, rpio.OUTPUT);
    rpio.open(ccw, rpio.OUTPUT);
    rpio.pwmSetRange(enable, PWM_RANGE);
    rpio.pwmSetClockDivider(8); // ~19.2kHz PWM (pas aan indien nodig)

    rpio.write(cw, 0);
    rpio.write(ccw, 1);
  }

  Setup.prototype.ramp = function (value) {
    var _this = this;

    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    this.targetSpeed = value;
    this.startSpeed = this.speed;
    this.rampDir = Math.sign(this.targetSpeed - this.startSpeed);
    this.accAngle = angle || 1;
    this.ramping = true;
    this.t1 = 0;
    clearInterval(this.interval);
    this.interval = setInterval(function () {
      return rampStep(_this);
    }, 20);
  };

  function rampStep(mot) {
    if (Math.abs(mot.speed - mot.targetSpeed) < 1) {
      mot.speed = mot.targetSpeed;
      mot.ramping = false;
      clearInterval(mot.interval);
      setPWM(mot, mot.speed);
      return;
    }

    mot.t1 += 20;
    var newSpeed = mot.startSpeed + mot.rampDir * (1 / mot.accAngle) * mot.t1;
    setPWM(mot, newSpeed);
  }

  function setPWM(mot, value) {
    value = Math.max(0, Math.min(255, Math.round(value)));
    if (value < mot.minSpeed) value = 0;
    mot.speed = value;
    rpio.pwmWrite(mot.enable, value);
  }

  Setup.prototype.drive = function (v) {
    var dir = Math.sign(v) > 0;
    rpio.write(this.cw, dir ? 0 : 1);
    rpio.write(this.ccw, dir ? 1 : 0);
    var pwm = Math.abs(v);
    pwm = Math.max(0, Math.min(255, pwm));
    if (pwm <= this.minSpeed) pwm = 0;
    if (pwm > 250) pwm = this.maxSpeed;
    setPWM(this, pwm);
  };

  Setup.prototype.stop = function () {
    this.ramp(0, 1);
  };

  Setup.prototype.cleanup = function () {
    clearInterval(this.interval);
    rpio.write(this.enable, 0);
    rpio.write(this.cw, 0);
    rpio.write(this.ccw, 0);
    rpio.close(this.enable);
    rpio.close(this.cw);
    rpio.close(this.ccw);
  }; // Extra methodes (indien nodig)


  Setup.prototype.rampUp = function (angle) {
    this.ramp(255, angle);
  };

  Setup.prototype.rampDown = function (angle) {
    this.ramp(0, angle);
  };

  Setup.prototype.isOn = function () {
    return this.speed !== 0;
  };

  return {
    Setup: Setup
  };
}();

module.exports = TomMotor;