const Gpio = require("pigpio").Gpio;
var Mes2 = new Gpio(25, {
  // als dit niet buiten de constructor staat werkt het niet ook niet als je this gebruikt !
  mode: Gpio.OUTPUT,
}); // 7/8/25 zijn vrij??

class Mower {
  constructor() {
    var Motor = require("./TomMotor.js"); //geo = require('.lib/TomGeolib.js'), bij in gps.js gezet

    this.LMotor = new Motor.Setup(11, 10, 9, 10, 255); //13, 19, 26, 10, 255) //22,27,17
    this.RMotor = new Motor.Setup(26, 27, 17, 10, 255); //16, 20, 21, 10, 255), //11,10,9 gpio22 is stuk op mowpi1
    this.simulatie = false; // dit moet je vanaf nu herzetten op false anders worden de motoren niet aangestuurd
    this.state = "ready";
    this.wheelBaseCm = 47;
    this.mes = false;
    this.Mes1 = new Gpio(18, {
      mode: Gpio.OUTPUT,
    });

    let lastLM = 0;
    let lastRM = 0;
    this.Mes1.digitalWrite(0);
    Mes2.servoWrite(1000);
    //console.log(Object.getOwnPropertyNames(Mes2))
  }
  drive(LM, RM) {
    if (!this.simulatie) {
      this.LMotor.drive(LM);
      this.RMotor.drive(RM);
    }
    this.state = "driving";
    //if (LM != lastLM || RM != lastRM) {
    //	console.log('vanuit Mower class:  LM: %s, RM: %s',LM,RM)
    //	lastLM = LM
    //	lastRM = RM
    //}
  }
  stop() {
    this.LMotor.drive(0);
    this.RMotor.drive(0);
    this.state = "stopped";
    //console.log('vanuit Mower class: stopped')
  }
  cleanup() {
    this.LMotor.cleanup();
    this.RMotor.cleanup();
  }
  setMes(state) {
    this.mes = state;
    if (state) {
      //messen starten
      this.Mes1.digitalWrite(1); //mes1 starten
      setTimeout(function () {
        //mes2 starten na 0,5 sec
        Mes2.servoWrite(1600); //1000 tot 2000 is de draaisnelheid van het mes
      }, 500);
    } else {
      //messen Stoppen
      this.Mes1.digitalWrite(0);
      Mes2.servoWrite(1000);
    }
  }
  setTarget(lat, lon) {
    this.target.lat = lat;
    this.target.lon = lon;
    this.state = "driveToTarget";
  }
  getState() {
    return this.state;
  }
  doUturn(side) {
    if (side === "R") {
      this.drive();
    }
  }
  // linear: m/s // source = ARDUMOWER
  // angular: rad/s
  // -------unicycle model equations----------
  //      L: wheel-to-wheel distance
  //     VR: right speed (m/s)
  //     VL: left speed  (m/s)
  //  omega: rotation speed (rad/s)
  //      V     = (VR + VL) / 2       =>  VR = V + omega * L/2
  //      omega = (VR - VL) / L       =>  VL = V - omega * L/2
  setLinearAngularSpeed(linear, angular, useLinearRamp) {
    //setLinearAngularSpeedTimeout = millis() + 1000;
    //setLinearAngularSpeedTimeoutActive = true;
    //if ((activateLinearSpeedRamp) && (useLinearRamp)) {
    //	linearSpeedSet = 0.9 * linearSpeedSet + 0.1 * linear;
    //} else {
    linearSpeedSet = linear;
    //}
    angularSpeedSet = angular;
    rspeed = linearSpeedSet + angularSpeedSet * (this.wheelBaseCm / 100.0 / 2);
    lspeed = linearSpeedSet - angularSpeedSet * (this.wheelBaseCm / 100.0 / 2);
    if (!this.simulatie) {
      this.LMotor.drive(lspeed);
      this.RMotor.drive(rspeed);
    }

    // RPM = V / (2*PI*r) * 60
    ///motorRightRpmSet =  rspeed / (PI*(((float)wheelDiameter)/1000.0)) * 60.0;
    ///motorLeftRpmSet = lspeed / (PI*(((float)wheelDiameter)/1000.0)) * 60.0;
    /*CONSOLE.print("setLinearAngularSpeed ");*/
  }
  getCircleSpeeds(left, radius) {
    console.log('in getcircle')
    radius = Math.abs(radius)
    let speed = ((radius - this.wheelBaseCm/2)/(radius + this.wheelBaseCm/2))*1
    let rspeed = 1
    let lspeed = 1
    if (left) {
      lspeed = speed
    } else rspeed = speed
    console.log('in getCircleSpeeds left %s, radius, %s|  %s , %s', left, radius, lspeed, rspeed)
    return [lspeed, rspeed]
  }
}
module.exports = new Mower();
