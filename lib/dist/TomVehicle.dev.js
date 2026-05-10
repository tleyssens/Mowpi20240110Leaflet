"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debugTomVehicle = require("debug")("tom1:TomVehicle");

var _require = require("../lib/vec3"),
    vec3 = _require.vec3,
    vec2 = _require.vec2,
    constants = require("../lib/constants");

var Vehicle =
/*#__PURE__*/
function () {
  function Vehicle() {
    _classCallCheck(this, Vehicle);

    this.wheelbase = 50;
    this.minTurningRadius = 3;
  }

  _createClass(Vehicle, [{
    key: "Vehicle",
    value: function Vehicle(_f) {
      this.mf = _f;
    }
  }, {
    key: "UpdateGoalPointDistance",
    value: function UpdateGoalPointDistance() {
      //debugTomVehicle("in UpdateGoalPointDistance %O", this.mf)
      //how far should goal point be away  - speed * seconds * kmph -> m/s then limit min value
      var goalPointDistance = this.mf.avgSpeed * this.mf.vehicle.goalPointLookAhead * 0.05 * this.mf.vehicle.goalPointLookAheadMult;
      goalPointDistance += this.mf.vehicle.goalPointLookAhead;
      if (goalPointDistance < 0.2) goalPointDistance = 0.2;
      return goalPointDistance;
    }
  }]);

  return Vehicle;
}();

module.exports = new Vehicle();