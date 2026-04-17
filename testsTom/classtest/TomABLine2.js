let debugTomABLine = require("debug")("tom1:TomABLine");
const { vec3, vec2 } = require("../../lib/vec3"),
  constants = require("../../lib/constants");

class ABLine {
  constructor(easting, northing) {
    (this.abHeading = 0.1), (this.abLength = 1600);
    this.currentABLineP1 = new vec3(0.0, 0.0, 0.0);
    this.currentABLineP2 = new vec3(0.0, 0.0, 0.0);
    this.refABLineP1 = new vec2(0.0, 0.0);
    this.refABLineP2 = new vec2(0.0, 1.0);
    //the two inital A and B points
    this.refPoint1 = new vec2(0.2, 0.15);
    this.refPoint2 = new vec2(0.3, 0.3);

    this.easting = easting;
    this.northing = northing;
    this.isABValid = false;
  }

  ABLine(mf) {
    this.mf = mf;
  }
  BuildCurrentABLineList(pivot) {
    let dx, dy;

    //lastSecond = mf.secondsSinceStart

    //move the ABLine over based on the overlap amount set in
    let widthMinusOverlap = this.mf.tool.toolWidth - this.mf.tool.toolOverlap;
    debugTomABLine(widthMinusOverlap);

    //x2-x1
    dx = this.refABLineP2.easting - this.refABLineP1.easting;
    debugTomABLine(dx);
    //z2-z1
    dy = this.refABLineP2.northing - this.refABLineP1.northing;
    debugTomABLine(dy);

    let distanceFromRefLine =
      (dy * this.mf.guidanceLookPos.easting -
        dx * this.mf.guidanceLookPos.northing +
        this.refABLineP2.easting * this.refABLineP1.northing -
        this.refABLineP2.northing * this.refABLineP1.easting) /
      Math.sqrt(dy * dy + dx * dx);
    debugTomABLine("distanceFromRefLine", distanceFromRefLine);

    let isLateralTriggered = false;

    let isHeadingSameWay =
      Math.PI - Math.abs(Math.abs(pivot.heading - this.abHeading) - Math.PI) <
      constants.PIBy2;
    debugTomABLine("isHeadingSameWay", isHeadingSameWay);
    //if (mf.yt.isYouTurnTriggered) isHeadingSameWay = !isHeadingSameWay;

    let howManyPathsAway;
    //Which ABLine is the vehicle on, negative is left and positive is right side
    let RefDist =
      (distanceFromRefLine +
        (isHeadingSameWay
          ? this.mf.tool.toolOffset
          : -this.mf.tool.toolOffset)) /
      widthMinusOverlap;
    if (RefDist < 0) howManyPathsAway = RefDist - 0.5;
    else howManyPathsAway = RefDist + 0.5;
    debugTomABLine("RefDist", RefDist);
    //depending which way you are going, the offset can be either side
    let point1 = new vec2(
      Math.cos(-this.abHeading) *
        (widthMinusOverlap * howManyPathsAway +
          (isHeadingSameWay
            ? -this.mf.tool.toolOffset
            : this.mf.tool.toolOffset)) +
        this.refPoint1.easting,
      Math.sin(-this.abHeading) *
        (widthMinusOverlap * howManyPathsAway +
          (isHeadingSameWay
            ? -this.mf.tool.toolOffset
            : this.mf.tool.toolOffset)) +
        this.refPoint1.northing
    );

    //create the new line extent points for current ABLine based on original heading of AB line
    this.currentABLineP1.easting =
      point1.easting - Math.sin(this.abHeading) * this.abLength;
    this.currentABLineP1.northing =
      point1.northing - Math.cos(this.abHeading) * this.abLength;

    this.currentABLineP2.easting =
      point1.easting + Math.sin(this.abHeading) * this.abLength;
    this.currentABLineP2.northing =
      point1.northing + Math.cos(this.abHeading) * this.abLength;

    this.currentABLineP1.heading = this.abHeading;
    this.currentABLineP2.heading = this.abHeading;

    this.isABValid = true;
  }
}
module.exports = ABLine;
