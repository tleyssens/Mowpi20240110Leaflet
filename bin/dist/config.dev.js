"use strict";

var useSimulation = true; //Zet op false om hardware aan te sturen

var s = require('./settings.json');

var constants = require('../lib/constants');

var Mower = useSimulation ? require("../lib/MowerLeeg") : require("../lib/Mower");
module.exports = {
  s: s,
  constants: constants,
  Mower: Mower
};