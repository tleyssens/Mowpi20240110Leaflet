let debugTomVehicle = require("debug")("tom1:TomVehicle");
const { vec3, vec2 } = require("../lib/vec3"),
  constants = require("../lib/constants");

class Vehicle {
  constructor() {
    this.wheelbase = 50;
    this.minTurningRadius = 3;
  }
  Vehicle(_f) {
    this.mf = _f;
  }
  UpdateGoalPointDistance() {
    //debugTomVehicle("in UpdateGoalPointDistance %O", this.mf)
    // //how far should goal point be away  - speed * seconds * kmph -> m/s then limit min value
    let goalPointDistance =
      this.mf.avgSpeed *
      this.mf.vehicle.goalPointLookAhead *
      0.05 *
      this.mf.vehicle.goalPointLookAheadMult;
    goalPointDistance += this.mf.vehicle.goalPointLookAhead;

    if (goalPointDistance < 0.2) goalPointDistance = 0.2;

    return goalPointDistance;
  }
}
module.exports = new Vehicle();
