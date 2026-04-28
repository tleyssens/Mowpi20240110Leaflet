"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var rpio = require('rpio');

var Mes2 = 25; // GPIO 25 voor mes2 (servo)

var Mower =
/*#__PURE__*/
function () {
  function Mower() {
    _classCallCheck(this, Mower);

    var Motor = require("./TomMotor.js");

    this.LMotor = new Motor.Setup(11, 10, 9, 10, 255);
    this.RMotor = new Motor.Setup(26, 27, 17, 10, 255);
    this.simulatie = false;
    this.state = "ready";
    this.wheelBaseCm = 47;
    this.mes = false; // Mes1 (simple on/off)

    rpio.open(18, rpio.OUTPUT);
    rpio.write(18, 0); // Mes2 (servo)

    rpio.open(Mes2, rpio.PWM);
    rpio.pwmSetRange(Mes2, 20000); // 20ms periode voor servo

    rpio.pwmSetClockDivider(Mes2, 192); // ~50Hz

    this.servoWrite(1000); // neutraal
  }

  _createClass(Mower, [{
    key: "servoWrite",
    value: function servoWrite(us) {
      // us = microseconden (1000 - 2000)
      var duty = Math.round(us * 1.2); // ruwe conversie voor rpio PWM

      rpio.pwmWrite(Mes2, duty);
    }
  }, {
    key: "drive",
    value: function drive(LM, RM) {
      if (!this.simulatie) {
        this.LMotor.drive(LM);
        this.RMotor.drive(RM);
      }

      this.state = "driving";
    }
  }, {
    key: "stop",
    value: function stop() {
      this.LMotor.drive(0);
      this.RMotor.drive(0);
      this.state = "stopped";
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      this.LMotor.cleanup();
      this.RMotor.cleanup();
      rpio.write(18, 0);
      this.servoWrite(1000);
    }
  }, {
    key: "setMes",
    value: function setMes(state) {
      var _this = this;

      this.mes = state;

      if (state) {
        rpio.write(18, 1); // Mes1 aan

        setTimeout(function () {
          _this.servoWrite(1600); // Mes2 aan

        }, 500);
      } else {
        rpio.write(18, 0); // Mes1 uit

        this.servoWrite(1000); // Mes2 stop
      }
    }
  }, {
    key: "setLinearAngularSpeed",
    value: function setLinearAngularSpeed(linear, angular) {
      var rspeed = linear + angular * (this.wheelBaseCm / 100 / 2);
      var lspeed = linear - angular * (this.wheelBaseCm / 100 / 2);

      if (!this.simulatie) {
        this.LMotor.drive(lspeed);
        this.RMotor.drive(rspeed);
      }
    }
  }, {
    key: "getCircleSpeeds",
    value: function getCircleSpeeds(left, radius) {
      radius = Math.abs(radius);
      var speed = (radius - this.wheelBaseCm / 2) / (radius + this.wheelBaseCm / 2);
      return left ? [speed, 1] : [1, speed];
    }
  }]);

  return Mower;
}();

module.exports = new Mower();