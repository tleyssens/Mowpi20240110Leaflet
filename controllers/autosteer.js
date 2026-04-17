let debugAutosteer = require("debug")("tom:autosteer"),
    s = require("../bin/settings.json"),
    GPS = require("gps"),
    mower = require("../lib/MowerLeeg");

exports.update = function (gps, socketList) {
    debugAutosteer("in autosteer.update")
    s.GUI.mf.isAutoSteerBtnOn = true
    switch (s.AS.state) {
        case 100:
            debugAutosteer("Autosteer 100")
            socketList.emit(
                "ABLijn",
                GPS.ConvertLocalToWGS84(gps.latStart,gps.lonStart,s.ABLine.currentABLineP1.easting,s.ABLine.currentABLineP1.northing),
                GPS.ConvertLocalToWGS84(gps.latStart,gps.lonStart,s.ABLine.currentABLineP2.easting,s.ABLine.currentABLineP2.northing)
            );
            s.GUI.angleError = GPS.toDegrees(s.ABLine.abFixHeadingDelta);
            
            socketList.emit('log', s.GUI.angleError)
            let left = Math.sign(s.GUI.mf.guidanceLineSteerAngle) === 1
            let circleSpeed = mower.getCircleSpeeds(left, s.ABLine.ppRadiusAB*10)//20240208 was 100
            s.GUI.LM = s.autoMowSpeed * circleSpeed[0]
            s.GUI.RM = s.autoMowSpeed * circleSpeed[1]   
            s.nearestPointOnAB = GPS.ConvertLocalToWGS84(
                gps.latStart,
                gps.lonStart,
                s.ABLine.rEastAB,
                s.ABLine.rNorthAB
              );
            socketList.emit("futurePoint", s.nearestPointOnAB);
            s.goalPointOnAB = GPS.ConvertLocalToWGS84(
                gps.latStart,
                gps.lonStart,
                s.ABLine.goalPointAB.easting,
                s.ABLine.goalPointAB.northing
              );
              //debugNmeaFunc('goalpoint %s', s.goalPointOnAB)
              socketList.emit("targetA", s.goalPointOnAB);
              let radiusPoint = GPS.ConvertLocalToWGS84(
                gps.latStart,
                gps.lonStart,
                s.ABLine.radiusPointAB.easting,
                s.ABLine.radiusPointAB.northing
              );
              let ppCircle = [radiusPoint[0], radiusPoint[1], s.ABLine.ppRadiusAB]
              socketList.emit("placeCircle", ppCircle, "#FF0000")
              let gpCircle = [gps.state.lat, gps.state.lon, s.ABLine.goalPointDistance]
              socketList.emit("goalPointDistance", s.ABLine.goalPointDistance)
              socketList.emit("placeCircle", gpCircle, "#00FF00")
              debugAutosteer('LM %s, RM %s, \u03B1 %s',s.GUI.LM,s.GUI.RM, s.GUI.angleError)
              //debugAutosteer(s.ABLine)
        break;
        case 110:
            debugAutosteer("Autosteer 110")
        break;
    }
};
