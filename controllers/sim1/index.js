'use strict';
function sim() {};
console.log('in sim: index.js');
sim.prototype.constructor = sim;
require('./simulatie1')(sim);
module.exports = sim;