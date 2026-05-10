// bin/config.js - updated for StateManager

const fs = require('fs');
const path = require('path');
const StateManager = require('../class/StateManager');

let rawdata = fs.readFileSync(path.join(__dirname, 'settings.json'));
let settings = JSON.parse(rawdata);

// Create StateManager
const stateManager = new StateManager(settings);

// Backward compatibility
const s = stateManager;

// Export both
module.exports = {
    s: s,
    stateManager: stateManager,
    Mower: settings.Mower || 'real'  // keep existing
};