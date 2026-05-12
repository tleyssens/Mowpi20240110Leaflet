// socketApi.js - StateManager versie (volledig werkend)
module.exports = function (stateManager, io) {
    
    // Backward compatibility
    const s = stateManager;

    // io opslaan voor oude code
    this.io = io;

    const { Mower } = require("./bin/config");
    var SocketApiDebug = require('debug')('tom:socketApi')
    const fs = require('fs')
    const util = require('util');
    const fsPromises = fs.promises;
    const path = require('path')
    const directoryPath = path.join(__dirname, 'public/MissionPlan')
    
    var socketApi = {};
    var mower = Mower;

    let socketFunc = require('./controllers/socketFunc')
    let nmeaFunc = require('./controllers/nmeaFunc')
    let MPU6050 = require('./lib/tom_i2c-mpu6050')

    let sensoraanwezig = false
    let angle = 0

    io.on('connection', function (socket) {
        SocketApiDebug(' *** A user connected: Mes = %s', s.get('GUI.MaaiMES'))

        socket.emit('state', s.get('GUI'))

        socket.on('KnopMes', function () {
            SocketApiDebug('Mesknop bedient in client')
            let current = s.get('GUI.MaaiMES')
            s.set('GUI.MaaiMES', !current)
            mower.setMes(s.get('GUI.MaaiMES'))
            io.sockets.emit('state', s.get('GUI'))
        })

        socket.on('KnopReset', function() {
            s.set('GUI.Autosteer', false)
            nmeaFunc.Reset()
            io.sockets.emit('state', s.get('GUI'))
            io.sockets.emit('RemoveMarkers')
        })

        socket.on('KnopTest', function() {
            let current = s.get('GUI.SlowTest')
            s.set('GUI.SlowTest', !current)
            nmeaFunc.slowStream(s.get('GUI.SlowTest'))
            io.sockets.emit('state', s.get('GUI'))
        })

        socket.on('KnopNMEA', function () {
            let current = s.get('GUI.NMEA.state')
            s.set('GUI.NMEA.state', !current)
            io.sockets.emit('state', s.get('GUI'))
            
            if (s.get('GUI.NMEA.state')) {
                nmeaFunc.startStream1(socket, s, io.sockets)
            } else {
                nmeaFunc.stopStream1()
            }
        })

        socket.on('NMEAsource', function (choice) {
            SocketApiDebug('NMEAsource gekozen: ' + choice)
            s.set('GUI.NMEA.choice', choice)
            io.sockets.emit('state', s.get('GUI'))

            if (choice === "GPS Simulatie" || choice === "GPSudp Simulatie") {
                socket.on('key', nmeaFunc.KeyReceived)
            } else if (choice === "GPS" || choice === "GPSudp") {
                socket.on('key', socketFunc.KeyReceived)
            }
        })

        socket.on('KnopMission', function () {
            s.set('GUI.mission.active', !s.get('GUI.mission.active'))
            io.sockets.emit('state', s.get('GUI'))
        })

        socket.on('KnopAutosteer', function () {
            let current = s.get('GUI.Autosteer')
            s.set('GUI.Autosteer', !current)
            io.sockets.emit('state', s.get('GUI'))
        })

        socket.on('DriveEnable', function () {
            let current = s.get('GUI.driveEnable')
            s.set('GUI.driveEnable', !current)
            io.sockets.emit('state', s.get('GUI'))
        })

        // Voeg hier later meer events toe indien nodig
        socket.on("*", function (event, data) {
            SocketApiDebug('Event: ' + event)
        })
    })

    // Extra functies
    socketApi.sendNotification = function () {
        io.sockets.emit('hello', { msg: 'Hello World!' })
    }

    return socketApi
}