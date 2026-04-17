let TestGuidanceDebug = require("debug")("tom:TestGuidance");
let mf = require("./mf.json");
const {vec3, vec2} = require('../lib/vec3')
let curPtA = new vec3(0.5, 0.5, 0.0)
let curPtB = new vec3(0.5, 1.0, 0.0)
let pivot = new vec3(0.0, 0.0, 0.7)
let steer = new vec3(0.1, 0.0, 0.7)

let TomGuidance = require("../lib/TomGuidance");
let Guidance = new TomGuidance();
Guidance.Guidance(mf);
TestGuidanceDebug(Guidance);
// console.log("fout");
// for (let i = 0; i < 11; i++) {
//   console.log(i);
//   Guidance.DoSteerAngleCalc();
//   TestGuidanceDebug(Guidance);
// }
Guidance.StanleyGuidanceABLine(curPtA, curPtB, pivot, steer)
TestGuidanceDebug(mf)