let debugTomGuidance = require("debug")("tom1:TomGuidance");
const { vec3, vec2 } = require("../lib/vec3"),
  { toDegrees } = require("../lib/TomGPS");
const constants = require("./constants");
let xTrackSteerCorrection = 0;
let counter = 0;
let distSteerError = 5;
let distanceFromCurrentLineSteer = 0,
  distanceFromCurrentLinePivot = 2,
  derivativeDistError = 0,
  lastDistSteerError = 0,
  steerAngleGu = 0,
  rEastSteer = 0,
  rNorthSteer = 0,
  rEastPivot = 0,
  rNorthPivot = 0,
  steerHeadingError = 0,
  inty = 0.0;

class Guidance {
  constructor() {
    (this.steerHeadingError = 5), (this.abLength = 10);
  }

  Guidance(mf) {
    this.mf = mf;
  }
  DoSteerAngleCalc() {
    debugTomGuidance("in DoSteerAngleCalc")
    if (this.mf.isReverse) this.steerHeadingError *= -1;
    //Overshoot setting on Stanley tab
    this.steerHeadingError *= this.mf.vehicle.stanleyHeadingErrorGain;

    let sped = Math.abs(this.mf.avgSpeed);
    if (sped > 1) sped = 1 + 0.277 * (sped - 1);
    else sped = 1;
    let XTEc = Math.atan(
      (distanceFromCurrentLineSteer *
        this.mf.vehicle.stanleyDistanceErrorGain) /
        sped
    );

    xTrackSteerCorrection = xTrackSteerCorrection * 0.5 + XTEc * 0.5;

    //derivative of steer distance error
    distSteerError = distSteerError * 0.95 + xTrackSteerCorrection * 60 * 0.05;
    if (counter++ > 5) {
      derivativeDistError = distSteerError - lastDistSteerError;
      lastDistSteerError = distSteerError;
      counter = 0;
    }

    steerAngleGu = toDegrees(
      (xTrackSteerCorrection + this.steerHeadingError) * -1.0
    );

    if (Math.abs(distanceFromCurrentLineSteer) > 0.5) steerAngleGu *= 0.5;
    else steerAngleGu *= 1 - Math.abs(distanceFromCurrentLineSteer);

    //pivot PID
    let pivotDistanceError = 0;
    pivotDistanceError =
      pivotDistanceError * 0.6 + distanceFromCurrentLinePivot * 0.4;
    //pivotDistanceError = Math.atan((distanceFromCurrentLinePivot) / (sped)) * 0.2;
    //pivotErrorTotal = pivotDistanceError + pivotDerivative;

    if (
      this.mf.avgSpeed > this.mf.startSpeed &&
      this.mf.isAutoSteerBtnOn &&
      Math.abs(derivativeDistError) < 1 &&
      Math.abs(pivotDistanceError) < 0.25
    ) {
      //if over the line heading wrong way, rapidly decrease integral
      if (
        (inty < 0 && distanceFromCurrentLinePivot < 0) ||
        (inty > 0 && distanceFromCurrentLinePivot > 0)
      ) {
        inty +=
          pivotDistanceError * this.mf.vehicle.stanleyIntegralGainAB * -0.1;
      } else {
        inty +=
          pivotDistanceError * this.mf.vehicle.stanleyIntegralGainAB * -0.01;
      }

      //integral slider is set to 0
      if (this.mf.vehicle.stanleyIntegralGainAB == 0) inty = 0;
    } else inty *= 0.7;

    if (this.mf.isReverse) inty = 0;

    if (this.mf.ahrs.imuRoll != 88888)
      steerAngleGu += this.mf.ahrs.imuRoll * -sideHillCompFactor;

    if (steerAngleGu < -this.mf.vehicle.maxSteerAngle)
      steerAngleGu = -this.mf.vehicle.maxSteerAngle;
    else if (steerAngleGu > this.mf.vehicle.maxSteerAngle)
      steerAngleGu = this.mf.vehicle.maxSteerAngle;

    //Convert to millimeters from meters
    this.mf.guidanceLineDistanceOff = Math.round(
      distanceFromCurrentLinePivot * 1000.0
    ); //??, MidpointRounding.AwayFromZero);
    this.mf.guidanceLineSteerAngle = steerAngleGu * 100;
  }
  StanleyGuidanceABLine(curPtA, curPtB, pivot, steer) {
    //get the pivot distance from currently active AB segment   ///////////  Pivot  ////////////
    let dx = curPtB.easting - curPtA.easting;
    let dy = curPtB.northing - curPtA.northing;
    if (Math.abs(dx) < Number.EPSILON && Math.abs(dy) < Number.EPSILON) return;

    //save a copy of dx,dy in youTurn
    this.mf.yt.dxAB = dx;
    this.mf.yt.dyAB = dy;

    //how far from current AB Line is fix
    distanceFromCurrentLinePivot =
      (dy * pivot.easting -
        dx * pivot.northing +
        curPtB.easting * curPtA.northing -
        curPtB.northing * curPtA.easting) /
      Math.sqrt(dy * dy + dx * dx);

    if (!this.mf.ABLine.isHeadingSameWay) distanceFromCurrentLinePivot *= -1.0;

    this.mf.ABLine.distanceFromCurrentLinePivot = distanceFromCurrentLinePivot;
    let U =
      ((pivot.easting - curPtA.easting) * dx +
        (pivot.northing - curPtA.northing) * dy) /
      (dx * dx + dy * dy);

    rEastPivot = curPtA.easting + U * dx;
    rNorthPivot = curPtA.northing + U * dy;

    this.mf.ABLine.rEastAB = rEastPivot;
    this.mf.ABLine.rNorthAB = rNorthPivot;

    //get the distance from currently active AB segment of steer axle //////// steer /////////////
    let steerA = new vec3(curPtA);
    let steerB = new vec3(curPtB);

    //create the AB segment to offset
    steerA.easting += Math.sin(steerA.heading + constants.PIBy2) * inty;
    steerA.northing += Math.cos(steerA.heading + constants.PIBy2) * inty;

    steerB.easting += Math.sin(steerB.heading + constants.PIBy2) * inty;
    steerB.northing += Math.cos(steerB.heading + constants.PIBy2) * inty;

    dx = steerB.easting - steerA.easting;
    dy = steerB.northing - steerA.northing;

    if (Math.abs(dx) < Number.EPSILON && Math.abs(dy) < Number.EPSILON) return;

    //how far from current AB Line is fix
    distanceFromCurrentLineSteer =
      (dy * steer.easting -
        dx * steer.northing +
        steerB.easting * steerA.northing -
        steerB.northing * steerA.easting) /
      Math.sqrt(dy * dy + dx * dx);

    if (!this.mf.ABLine.isHeadingSameWay) distanceFromCurrentLineSteer *= -1.0;

    // calc point on ABLine closest to current position - for display only
    U =
      ((steer.easting - steerA.easting) * dx +
        (steer.northing - steerA.northing) * dy) /
      (dx * dx + dy * dy);

    rEastSteer = steerA.easting + U * dx;
    rNorthSteer = steerA.northing + U * dy;

    let steerErr = Math.atan2(
      rEastSteer - rEastPivot,
      rNorthSteer - rNorthPivot
    );
    steerHeadingError = steer.heading - steerErr;
    //Fix the circular error
    if (steerHeadingError > Math.PI) steerHeadingError -= Math.PI;
    else if (steerHeadingError < -Math.PI) steerHeadingError += Math.PI;

    if (steerHeadingError > constants.PIBy2) steerHeadingError -= Math.PI;
    else if (steerHeadingError < -constants.PIBy2) steerHeadingError += Math.PI;

    this.DoSteerAngleCalc();
  }
}

module.exports = Guidance;
