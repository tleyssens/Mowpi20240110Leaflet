const useSimulation = true; //Zet op false om hardware aan te sturen

var s = require('./settings.json');
const constants = require('../lib/constants');

const Mower  = useSimulation
  ? require("../lib/MowerLeeg")
  : require("../lib/Mower");

module.exports = {
    s,
    constants,
    Mower,
};