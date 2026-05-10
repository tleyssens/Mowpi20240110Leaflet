const useSimulation = true; //Zet op false om hardware aan te sturen

const StateManager = require('../class/StateManager');
var initialState = require('./settings.json');
const constants = require('../lib/constants');

const Mower  = useSimulation
  ? require("../lib/MowerLeeg")
  : require("../lib/Mower");

const stateManager = new StateManager(initialState);

module.exports = {
    s: stateManager,           // backward compatibility
    stateManager,
    constants,
    Mower,
};