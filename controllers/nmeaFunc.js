"use strict"; // gebruikt in simulatie
const { s, stateManager, constants, Mower } = require("../bin/config");

let debugNmeaFunc = require("debug")("tom1:NmeaFunc");
const dgram = require("dgram");
let vec2 = require("../lib/vec");
const { vec3 } = require("../lib/vec3");
const vecFix2Fix = require("../lib/vec3").vecFix2Fix;
let autosteer = require("./autosteer");

var mower = Mower;

var NMEAstream = require("./NMEAstream.js");

var teleplot = dgram.createSocket('udp4');

// === Backward compatibility voor StateManager ===
const isStateManager = s && typeof s.get === 'function' && typeof s.set === 'function';

if (isStateManager) {
  s.set('GUI.mf.guidanceLookPos', new vec2(0, 0));
  s.set('GUI.mf.fixHeading', 0.0);
  s.set('GUI.mf.guidanceLineSteerAngle', 90);
  s.set('GUI.mf.avgSpeed', 0);
} else {
  s.GUI.mf.guidanceLookPos = new vec2(0, 0);
  s.GUI.mf.fixHeading = 0.0;
  s.GUI.mf.guidanceLineSteerAngle = 90;
  s.GUI.mf.avgSpeed = 0
}

// Teleplot
let msg

let lastData = "",
    lastTime = ""
let prevQuality = ''
const { execFile } = require("child_process");
const split = require("split");
const PIDcontroller = require("node-pid-controller"),
  GPS = require("../lib/TomGPS"),
  gps = new GPS();
gps.state.bearing = 0;
gps.prevSpeedFix = new vec2(0, 0);
gps.avgSpeed = 0;
gps.speed = 0;
gps.previousSpeed = 0;
gps.startSpeed = 0.5;

// PID
if (isStateManager) {
  s.set('ctr', new PIDcontroller({
    k_p: s.get('pid.kp'),
    k_i: s.get('pid.ki'),
    k_d: s.get('pid.kd'),
    i_max: s.get('pid.imax'),
    target: s.get('pid.target'),
  }));
} else {
  s.ctr = new PIDcontroller({
    k_p: s.pid.kp,
    k_i: s.pid.ki,
    k_d: s.pid.kd,
    i_max: s.pid.imax,
    target: s.pid.target,
  });
}

var Sylvester = require("sylvester"),
  Kalman = require("kalman").KF;
var A = Sylvester.Matrix.I(2);
var B = Sylvester.Matrix.Zero(2, 2);
var H = Sylvester.Matrix.I(2);
var C = Sylvester.Matrix.I(2);
var Q = Sylvester.Matrix.I(2).multiply(1e-5);
var R = Sylvester.Matrix.I(2).multiply(0.000002);

//startpunt
var start1 = isStateManager ? s.get('start1') : s.start1;
var u = $V([start1.lat, start1.lng]);
var filter = new Kalman(
  u,
  $M([
    [1, 0],
    [0, 1],
  ])
);

var pathPlan = require("./pathPlanning");
var recordPath = require("./recordPath");
let mission = require("./mission20221019");

let startCounter = 0,
  speedCounter = 0,
  gpsHz = isStateManager ? s.get('gpsHz') : s.gpsHz;

// ... rest van de file blijft hetzelfde voor nu (we fixen alleen de initialisatie)

exports.KeyReceived = function (data) { /* ... */ };

exports.startStream1 = function (socket, s, socketList) { /* ... */ };

// (De rest van de functies blijven ongewijzigd voor deze stap)