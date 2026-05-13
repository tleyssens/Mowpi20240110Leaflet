"use strict";

const config = require("../bin/config");
const stateManager = config.stateManager;
const s = config.s; // backward compatibility

const isStateManager = !!(stateManager && typeof stateManager.get === 'function');

let debugAutosteer = require("debug")("tom:autosteer"),
    GPS = require("gps"),
    mower = config.Mower;

// Helper functies voor StateManager
function getState(key) {
    if (isStateManager) {
        return stateManager.get(key);
    }
    return key ? s[key] : s;
}
function setState(key, value) {
    if (isStateManager) {
        stateManager.set(key, value);
    } else if (key.includes('.')) {
        const keys = key.split('.');
        let obj = s;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) obj[keys[i]] = {};
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
    } else {
        s[key] = value;
    }
}

exports.update = function (gps, socketList) {
    debugAutosteer("in autosteer.update")
    setState('GUI.mf.isAutoSteerBtnOn', true);
    switch (getState('AS.state') || 100) {
        case 100:
            debugAutosteer("Autosteer 100")
            socketList.emit(
                "ABLijn",
                GPS.ConvertLocalToWGS84(
                    gps.latStart,gps.lonStart,
                    getState('ABLine.currentABLineP1.easting'), 
                    getState('ABLine.currentABLineP1.northing')),
                GPS.ConvertLocalToWGS84(
                    gps.latStart,gps.lonStart,
                    getState('ABLine.currentABLineP2.easting'),
                    getState('ABLine.currentABLineP2.northing'))
            );
            setState('GUI.angleError', GPS.toDegrees(getState('ABLine.abFixHeadingDelta')));
            
            socketList.emit('log', getState('GUI.angleError'))
            let left = Math.sign(getState('GUI.mf.guidanceLineSteerAngle')) === 1
            let circleSpeed = mower.getCircleSpeeds(left, getState('ABLine.ppRadiusAB')*10)//20240208 was 100
            setState('GUI.LM', getState('autoMowSpeed') * circleSpeed[0])
            setState('GUI.RM', getState('autoMowSpeed') * circleSpeed[1]);   
            setState('GUI.nearestPointOnAB', GPS.ConvertLocalToWGS84(
                gps.latStart,
                gps.lonStart,
                getState('ABLine.rEastAB'),
                getState('ABLine.rNorthAB')
              )
            );
            socketList.emit("futurePoint", getState('GUI.nearestPointOnAB'));// blauw kruisje = futurepoint
            setState('GUI.goalPointOnAB', GPS.ConvertLocalToWGS84(
                gps.latStart,
                gps.lonStart,
                getState('ABLine.rEastAB'),
                getState('ABLine.rNorthAB')
              )
            );
            //debugNmeaFunc('goalpoint %s', s.goalPointOnAB)
            socketList.emit("targetA", getState('GUI.goalPointOnAB')); // rood cirkeltje = trajectPoint
            setState('GUI.radiusPoint', GPS.ConvertLocalToWGS84(
                gps.latStart,
                gps.lonStart,
                getState('ABLine.radiusPointAB.easting'),
                getState('ABLine.radiusPointAB.northing')
              )
            );
            let ppCircle = [radiusPoint[0], radiusPoint[1], getState('ABLine.ppRadiusAB')]
            socketList.emit("placeCircle", ppCircle, "#FF0000")
            let gpCircle = [gps.state.lat, gps.state.lon, getState('ABLine.goalPointDistance')]
            socketList.emit("goalPointDistance", getState('ABLine.goalPointDistance'))
            socketList.emit("placeCircle", gpCircle, "#00FF00")
            debugAutosteer('LM %s, RM %s, \u03B1 %s',getState('GUI.LM'),getState('GUI.RM'), getState('GUI.angleError'))
            //debugAutosteer(s.ABLine)
        break;
        case 110:
            debugAutosteer("Autosteer 110")
        break;
    }
};
