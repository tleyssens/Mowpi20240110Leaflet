const rpio = require('rpio');

var Mes2 = 25;  // GPIO 25 voor mes2 (servo)

class Mower {
  constructor() {
    const Motor = require("./TomMotor.js");

    this.LMotor = new Motor.Setup(11, 10, 9, 10, 255);
    this.RMotor = new Motor.Setup(26, 27, 17, 10, 255);

    this.simulatie = false;
    this.state = "ready";
    this.wheelBaseCm = 47;
    this.mes = false;

    // Mes1 (simple on/off)
    rpio.open(18, rpio.OUTPUT);
    rpio.write(18, 0);

    // Mes2 (servo)
    rpio.open(Mes2, rpio.PWM);
    rpio.pwmSetRange(Mes2, 20000);     // 20ms periode voor servo
    rpio.pwmSetClockDivider(Mes2, 192); // ~50Hz
    this.servoWrite(1000);             // neutraal
  }

  servoWrite(us) {
    // us = microseconden (1000 - 2000)
    const duty = Math.round(us * 1.2);   // ruwe conversie voor rpio PWM
    rpio.pwmWrite(Mes2, duty);
  }

  drive(LM, RM) {
    if (!this.simulatie) {
      this.LMotor.drive(LM);
      this.RMotor.drive(RM);
    }
    this.state = "driving";
  }

  stop() {
    this.LMotor.drive(0);
    this.RMotor.drive(0);
    this.state = "stopped";
  }

  cleanup() {
    this.LMotor.cleanup();
    this.RMotor.cleanup();
    rpio.write(18, 0);
    this.servoWrite(1000);
  }

  setMes(state) {
    this.mes = state;
    if (state) {
      rpio.write(18, 1);           // Mes1 aan
      setTimeout(() => {
        this.servoWrite(1600);     // Mes2 aan
      }, 500);
    } else {
      rpio.write(18, 0);           // Mes1 uit
      this.servoWrite(1000);       // Mes2 stop
    }
  }

  setLinearAngularSpeed(linear, angular) {
    const rspeed = linear + angular * (this.wheelBaseCm / 100 / 2);
    const lspeed = linear - angular * (this.wheelBaseCm / 100 / 2);

    if (!this.simulatie) {
      this.LMotor.drive(lspeed);
      this.RMotor.drive(rspeed);
    }
  }

  getCircleSpeeds(left, radius) {
    radius = Math.abs(radius);
    const speed = (radius - this.wheelBaseCm/2) / (radius + this.wheelBaseCm/2);
    return left ? [speed, 1] : [1, speed];
  }
}

module.exports = new Mower();