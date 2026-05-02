"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../bin/config'),
    constants = _require.constants;

var debugTomABLine = require("debug")("tom1:TomABLine");

var _require2 = require("../lib/vec3"),
    vec3 = _require2.vec3,
    vec2 = _require2.vec2;

var Vehicle = require("./TomVehicle");

var util = require("util"),
    GPS = require("../lib/TomGPS");

var dgram = require("dgram");

var teleplot = dgram.createSocket('udp4');
var msg;

var ABLine =
/*#__PURE__*/
function () {
  //private
  //#counter2 => je moet evenzeer this gebruiken
  function ABLine(easting, northing) {
    _classCallCheck(this, ABLine);

    this.abHeading = 0, this.abLength = 10; //m 1600m agopengps 200-5000m

    this.currentABLineP1 = new vec3(0.0, 0.0, 0.0);
    this.currentABLineP2 = new vec3(0.0, 0.0, 0.0);
    this.distanceFromCurrentLinePivot = 0;
    this.distanceFromRefLine = 0; //pure pursuit values

    this.goalPointAB = new vec2(0, 0);
    this.rEastAB;
    this.rNorthAB;
    this.refABLineP1 = new vec2(0.0, 0.0);
    this.refABLineP2 = new vec2(0.0, 1.0); //the two inital A and B points

    this.refPoint1 = new vec2(0.2, 0.15);
    this.refPoint2 = new vec2(0.3, 0.3);
    this.easting = easting;
    this.northing = northing;
    this.isABValid = false;
    this.isABLineSet = true;
    this.isHeadingSameWay = true;
    this.inty = 0;
    this.howManyPathsAway = 0;
    this.abFixHeadingDelta = 0;
    this.ppRadiusAB = 0;
    this.radiusPointAB = new vec2(0, 0);
    this.setAngVel = 0;
    this.steerAngleAB = 0;
    this.pivot;
    this.counter2 = 0;
    this.pivotDistanceError = 0;
    this.pivotDistanceErrorLast = 0;
    this.pivotDerivative = 0;
  }

  _createClass(ABLine, [{
    key: "ABLine",
    value: function ABLine(_f) {
      this.mf = _f;
      this.mf.guidanceLineDistanceOff = 0;
    }
  }, {
    key: "BuildCurrentABLineList",
    value: function BuildCurrentABLineList(pivot) {
      debugTomABLine("in BuildCurrentABLineList %o", pivot);
      debugTomABLine('mf = %o', this.mf); // OK

      this.pivot = pivot;
      var dx, dy; //lastSecond = mf.secondsSinceStart
      //move the ABLine over based on the overlap amount set in

      var widthMinusOverlap = this.mf.tool.toolWidth - this.mf.tool.toolOverlap;
      dx = this.refABLineP2.easting - this.refABLineP1.easting; //x2-x1

      dy = this.refABLineP2.northing - this.refABLineP1.northing; //z2-z1

      this.distanceFromRefLine = (dy * this.mf.guidanceLookPos.easting - dx * this.mf.guidanceLookPos.northing + this.refABLineP2.easting * this.refABLineP1.northing - this.refABLineP2.northing * this.refABLineP1.easting) / Math.sqrt(dy * dy + dx * dx);
      var isLateralTriggered = false;
      this.isHeadingSameWay = Math.PI - Math.abs(Math.abs(pivot.heading - this.abHeading) - Math.PI) < constants.PIBy2;
      this.isHeadingSameWay = true; //if (mf.yt.isYouTurnTriggered) isHeadingSameWay = !isHeadingSameWay;
      //debugTomABLine("%O", this);
      //Which ABLine is the vehicle on, negative is left and positive is right side

      var RefDist;
      RefDist = (this.distanceFromRefLine + (this.isHeadingSameWay ? this.mf.tool.toolOffset : -this.mf.tool.toolOffset)) / widthMinusOverlap;
      if (RefDist < 0) this.howManyPathsAway = parseInt(RefDist - 0.5);else this.howManyPathsAway = parseInt(RefDist + 0.5); //debugTomABLine("RefDist", RefDist);
      //depending which way you are going, the offset can be either side

      var point1 = new vec2(Math.cos(-this.abHeading) * (widthMinusOverlap * this.howManyPathsAway + (this.isHeadingSameWay ? -this.mf.tool.toolOffset : this.mf.tool.toolOffset)) + this.refPoint1.easting, Math.sin(-this.abHeading) * (widthMinusOverlap * this.howManyPathsAway + (this.isHeadingSameWay ? -this.mf.tool.toolOffset : this.mf.tool.toolOffset)) + this.refPoint1.northing); //create the new line extent points for current ABLine based on original heading of AB line

      this.currentABLineP1.easting = point1.easting - Math.sin(this.abHeading) * this.abLength;
      this.currentABLineP1.northing = point1.northing - Math.cos(this.abHeading) * this.abLength;
      this.currentABLineP2.easting = point1.easting + Math.sin(this.abHeading) * this.abLength;
      this.currentABLineP2.northing = point1.northing + Math.cos(this.abHeading) * this.abLength;
      this.currentABLineP1.heading = this.abHeading;
      this.currentABLineP2.heading = this.abHeading;
      this.isABValid = true;
    }
  }, {
    key: "GetCurrentABLine",
    value: function GetCurrentABLine(pivot, steer) {
      var dx = 0,
          dy = 0;
      if (!this.isABValid) this.BuildCurrentABLineList(pivot); //debugTomABLine(`pivot = ${GPS.toDegrees(pivot.heading)}`)

      if (this.mf.isPurePursuitUsed) {
        //debugTomABLine("PurePursuit");
        //get the distance from currently active AB line
        dx = this.currentABLineP2.easting - this.currentABLineP1.easting; //x2-x1

        dy = this.currentABLineP2.northing - this.currentABLineP1.northing; //z2-z1
        //how far from current AB Line is fix

        this.distanceFromCurrentLinePivot = (dy * pivot.easting - dx * pivot.northing + this.currentABLineP2.easting * this.currentABLineP1.northing - this.currentABLineP2.northing * this.currentABLineP1.easting) / Math.sqrt(dy * dy + dx * dx);
      } //this.inty = 0;


      if (this.mf.vehicle.purePursuitIntegralGain != 0) {
        //niet gebruikt
        this.pivotDistanceError = this.distanceFromCurrentLinePivot * 0.2 + this.pivotDistanceError * 0.8;

        if (this.counter2++ > 4) {
          this.pivotDerivative = this.pivotDistanceError - this.pivotDistanceErrorLast;
          this.pivotDistanceErrorLast = this.pivotDistanceError;
          this.counter2 = 0;
          this.pivotDerivative *= 2;
          debugTomABLine("*** pivotDistanceErr: %s Derivative", this.pivotDistanceError, this.pivotDerivative);
          msg = 'distanceFromCurrentLinePivot:' + this.distanceFromCurrentLinePivot + '|g';
          teleplot.send(msg, 0, msg.length, 47269, '127.0.0.1'); //limit the derivative
          //if (pivotDerivative > 0.03) pivotDerivative = 0.03;
          //if (pivotDerivative < -0.03) pivotDerivative = -0.03;
          //if (Math.Abs(pivotDerivative) < 0.01) pivotDerivative = 0;
        } //pivotErrorTotal = pivotDistanceError + pivotDerivative;


        if (this.mf.isAutoSteerBtnOn && Math.abs(this.pivotDerivative) < 0.1 && this.mf.avgSpeed > 1 //&& !mf.yt.isYouTurnTriggered
        ) {
            //if over the line heading wrong way, rapidly decrease integral
            debugTomABLine("distanceFromCurrentLinePivot %s", this.distanceFromCurrentLinePivot);

            if (this.inty < 0 && this.distanceFromCurrentLinePivot < 0 || this.inty > 0 && this.distanceFromCurrentLinePivot > 0) {
              this.inty += this.pivotDistanceError * this.mf.vehicle.purePursuitIntegralGain * -0.04; //was 0.04 ==>groter => draait vroeger van de lijn weg 0.4 is beter dan 0.04, 4 geraakt niet meer aan de lijn

              debugTomABLine("Foute richting => maal 0.04 => inty=%s", this.inty);
            } else {
              if (Math.abs(this.distanceFromCurrentLinePivot) > 0.02) {
                //was 0.02
                this.inty += this.pivotDistanceError * this.mf.vehicle.purePursuitIntegralGain * -0.02; //was -0.02

                debugTomABLine("Juiste richting => maal 0.02 => inty=%s", this.inty);
                if (this.inty > 0.2) this.inty = 0.2; // 0.2
                else if (this.inty < -0.2) this.inty = -0.2; //-0.2
              }
            }
          } else {
          this.inty *= 0.95; //was 0.95

          debugTomABLine("moglijkheid2 => inty = %s", this.inty);
        }
      } else this.inty = 0; // this.inty *= 0.5
      //Subtract the two headings, if > 1.57 its going the opposite heading as refAB


      this.abFixHeadingDelta = Math.abs(this.mf.fixHeading - this.abHeading);
      if (this.abFixHeadingDelta >= Math.PI) this.abFixHeadingDelta = Math.abs(this.abFixHeadingDelta - constants.twoPI); //debugTomABLine("Na %O", this);
      // ** Pure pursuit ** - calc point on ABLine closest to current position

      var U = ((pivot.easting - this.currentABLineP1.easting) * dx + (pivot.northing - this.currentABLineP1.northing) * dy) / (dx * dx + dy * dy); //point on AB line closest to pivot axle point

      this.rEastAB = this.currentABLineP1.easting + U * dx;
      this.rNorthAB = this.currentABLineP1.northing + U * dy; //debugTomABLine('voor goalPointDistance ')
      //update base on autosteer settings and distance from line
      //debugTomABLine(util.inspect(Vehicle, true, 10, true))

      var goalPointDistance = Vehicle.UpdateGoalPointDistance();
      this.goalPointAB.easting = this.rEastAB + Math.sin(this.abHeading) * goalPointDistance;
      this.goalPointAB.northing = this.rNorthAB + Math.cos(this.abHeading) * goalPointDistance;
      this.goalPointDistance = goalPointDistance; //debugTomABLine("ABLINE %O", this);
      //calc "D" the distance from pivot axle to lookahead point
      //debugTomABLine("GPS %s", GPS.DistanceSquared4(1,2,3,4))

      var goalPointDistanceDSquared = GPS.DistanceSquared4(this.goalPointAB.northing, this.goalPointAB.easting, pivot.northing, pivot.easting); //calculate the the new x in local coordinates and steering angle degrees based on wheelbase

      var localHeading = 0;
      if (this.isHeadingSameWay) localHeading = constants.twoPI - this.mf.fixHeading + this.inty;else localHeading = constants.twoPI - this.mf.fixHeading - this.inty;
      this.localHeading = GPS.toDegrees(localHeading);
      this.ppRadiusAB = goalPointDistanceDSquared / (2 * ((this.goalPointAB.easting - pivot.easting) * Math.cos(localHeading) + (this.goalPointAB.northing - pivot.northing) * Math.sin(localHeading)));
      this.steerAngleAB = GPS.toDegrees(Math.atan(2 * ((this.goalPointAB.easting - pivot.easting) * Math.cos(localHeading) + (this.goalPointAB.northing - pivot.northing) * Math.sin(localHeading)) * this.mf.vehicle.wheelbase / goalPointDistanceDSquared)); // if (this.mf.ahrs.imuRoll != 88888)
      //   this.steerAngleAB +=
      //     this.mf.ahrs.imuRoll * -this.mf.gyd.sideHillCompFactor;

      if (this.steerAngleAB < -this.mf.vehicle.maxSteerAngle) this.steerAngleAB = -this.mf.vehicle.maxSteerAngle;
      if (this.steerAngleAB > this.mf.vehicle.maxSteerAngle) this.steerAngleAB = this.mf.vehicle.maxSteerAngle; //limit circle size for display purpose

      if (this.ppRadiusAB < -500) this.ppRadiusAB = -500;
      if (this.ppRadiusAB > 500) this.ppRadiusAB = 500; //debugTomABLine("localHeading %s ", localHeading);

      this.radiusPointAB.easting = pivot.easting + this.ppRadiusAB * Math.cos(localHeading);
      this.radiusPointAB.northing = pivot.northing + this.ppRadiusAB * Math.sin(localHeading); // if (this.mf.isConstantContourOn) {
      //   //angular velocity in rads/sec  = 2PI * m/sec * radians/meters
      //   this.mf.setAngVel =
      //     (0.277777 *
      //       this.mf.avgSpeed *
      //       Math.tan(GPS.toRadians(this.steerAngleAB))) /
      //     this.mf.vehicle.wheelbase;
      //   this.mf.setAngVel = GPS.toDegrees(this.mf.setAngVel) * 100;
      //   //clamp the steering angle to not exceed safe angular velocity
      //   if (Math.abs(this.mf.setAngVel) > 1000) {
      //     //mf.setAngVel = mf.setAngVel < 0 ? -mf.vehicle.maxAngularVelocity : mf.vehicle.maxAngularVelocity;
      //     this.mf.setAngVel = this.mf.setAngVel < 0 ? -1000 : 1000;
      //   }
      // }
      //distance is negative if on left, positive if on right

      if (!this.isHeadingSameWay) this.distanceFromCurrentLinePivot *= -1.0; //Convert to millimeters

      this.mf.guidanceLineDistanceOff = this.distanceFromCurrentLinePivot < 0 ? -Math.round(-this.distanceFromCurrentLinePivot * 1000) : Math.round(this.distanceFromCurrentLinePivot * 1000); //Math.round(this.distanceFromCurrentLinePivot * 10000) / 10; //away from zero =afronden weg van de 0 op 0,1

      this.mf.guidanceLineSteerAngle = Math.round(this.steerAngleAB * 100);
    }
  }]);

  return ABLine;
}();

module.exports = ABLine;