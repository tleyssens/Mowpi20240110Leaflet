'use strict';

var TomMotorDebug = require('debug')('tom:TomMotor');

var rpio = require('rpio');

var TomMotor = function () {
  var startSpeed = 0,
      targetSpeed = 0,
      angle = 0,
      speed = 0,
      t1 = 0,
      ramping = false,
      minSpeed = 70;

  function Setup(enable, cw, ccw, minSpeed, maxSpeed) {
    TomMotorDebug('MotorSetup enable:%s cw:%s ccw:%s min:%s max:%s', enable, cw, ccw, minSpeed, maxSpeed);
    this.enable = enable;
    this.cw = cw;
    this.ccw = ccw;
    this.minSpeed = minSpeed || 70;
    this.maxSpeed = maxSpeed || 255;
    this.Forward = true;
    this.ramping = false;
    this.hitTargetSpeed = false; // Open pins

    rpio.open(enable, rpio.PWM); // PWM pin

    rpio.open(cw, rpio.OUTPUT);
    rpio.open(ccw, rpio.OUTPUT);
    rpio.write(cw, 0);
    rpio.write(ccw, 1);
  }

  Setup.prototype = {
    ramp: ramp,
    update: update,
    onTargetSpeed: onTargetSpeed,
    isOn: isOn,
    rampDown: rampDown,
    rampUp: rampUp,
    toggleDirection: toggleDirection,
    stop: stop,
    drive: drive,
    cleanup: cleanup
  };

  function ramp(value, angle) {
    this.angle = angle;
    this.startSpeed = this.speed || 0;
    this.targetSpeed = value;
    this.accAngle = angle;
    this.rampDir = Math.sign(this.targetSpeed - this.startSpeed);
    if (this.startSpeed < this.minSpeed) this.startSpeed = this.minSpeed;

    if (this.targetSpeed !== this.speed) {
      this.ramping = true;
      this.t1 = 20;
      this.update();
    }
  }

  function update() {
    var _this = this;

    clearInterval(this.interval);

    if (this.ramping) {
      this.interval = setInterval(function () {
        return ramp2(_this);
      }, 20);
    }
  }

  function ramp2(mot) {
    if (mot.speed !== mot.targetSpeed) {
      setSpeed(mot, mot.startSpeed + mot.rampDir * (1 / mot.accAngle) * mot.t1);
      mot.t1 += 20;
    } else {
      stopRamping(mot);
    }
  }

  function setSpeed(mot, value) {
    if (value > -1 && value < 256) {
      mot.speed = Math.round(value);
      rpio.pwmWrite(mot.enable, mot.speed); // 0-255
    }
  }

  function drive(v) {
    if (v > 0) {
      rpio.write(this.cw, 0);
      rpio.write(this.ccw, 1);
    } else {
      rpio.write(this.cw, 1);
      rpio.write(this.ccw, 0);
    }

    var absV = Math.abs(v);
    var pwmVal = absV <= this.minSpeed ? 0 : absV > 250 ? this.maxSpeed : Math.round(this.minSpeed + (this.maxSpeed - this.minSpeed) * (absV / 255));
    rpio.pwmWrite(this.enable, pwmVal);
    this.speed = pwmVal;
  }

  function onTargetSpeed() {
    if (!this.ramping) {
      if (!this.hitTargetSpeed) {
        this.hitTargetSpeed = true;
        return true;
      }

      return false;
    }

    this.hitTargetSpeed = false;
    return false;
  }

  function rampDown(angle) {
    this.ramp(0, angle);
  }

  function rampUp(angle) {
    this.ramp(255, angle);
  }

  function isOn() {
    return this.speed > 0;
  }

  function toggleDirection() {
    this.Forward = !this.Forward;
    rpio.write(this.cw, this.Forward ? 0 : 1);
    rpio.write(this.ccw, this.Forward ? 1 : 0);
  }

  function stop() {
    this.ramp(0, 1);
  }

  function cleanup() {
    rpio.write(this.enable, 0);
    rpio.close(this.enable);
    rpio.close(this.cw);
    rpio.close(this.ccw);
  }

  function stopRamping(mot) {
    mot.ramping = false;
    clearInterval(mot.interval);
  }

  return {
    Setup: Setup
  };
}();

module.exports = TomMotor;