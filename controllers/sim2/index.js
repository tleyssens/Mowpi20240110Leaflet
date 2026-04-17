'use strict';
function sim() {};
console.log('in sim2: index.js');
sim.prototype.constructor = sim;
require('./simulatie2')(sim);
module.exports = sim;