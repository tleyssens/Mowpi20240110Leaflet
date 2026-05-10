module.exports = function (stateManager) { //Tom: StateManager i.p.v. plain s
    const { Mower } = require("./bin/config");
    var SocketApiDebug = require('debug')('tom:socketApi')
    var socket_io = require('socket.io')
    var io = socket_io()
    const fs = require('fs')
    const util = require('util');
    const readdir = util.promisify(fs.readdir);
    const fsPromises = fs.promises;
    const path = require('path')
    const directoryPath = path.join(__dirname, 'public/MissionPlan')
    var socketApi = {};

    socketApi.io = io;
    var mower = Mower;

    // StateManager injecteren
    stateManager.setIO(io);

    let sensoraanwezig = false
    let i2c
    let MPU6050 = require('./lib/tom_i2c-mpu6050')
    let address = 0x68
    let gyroRate = 0
    let angle = 0

    if (sensoraanwezig) {
        let sensor = new MPU6050(i2c1, address);
        sensor.reset(address)
        SocketApiDebug(sensor.readSync())
        let offset = -2.4216
        setInterval(getAngle, 100)
    }

    function getAngle() {
        data = sensor.readSync()
        gyroRate = (data.gyro.x - offset)
        angle += gyroRate / 100
        stateManager.set('GUI.angleIMU', angle);
    }

    let socketFunc = require('./controllers/socketFunc')
    let nmeaFunc = require('./controllers/nmeaFunc')

    io.on('connection', function (socket) {
        SocketApiDebug(' *** A user connected:  Mes = %s, PID = %s', stateManager.get('GUI.MaaiMES'), process.pid)
        socket.emit('state', stateManager.get('GUI'))

        socket.on('KnopMes', function () {
            SocketApiDebug('Mesknop bedient in client')
            let current = stateManager.get('GUI.MaaiMES');
            stateManager.set('GUI.MaaiMES', !current);
            mower.setMes(stateManager.get('GUI.MaaiMES'));
        })

        socket.on('KnopReset', function() {
            stateManager.set('GUI.Autosteer', false);
            nmeaFunc.Reset()
        })

        socket.on('KnopTest', function() {
            let current = stateManager.get('GUI.SlowTest') || false;
            stateManager.set('GUI.SlowTest', !current);
            nmeaFunc.slowStream(stateManager.get('GUI.SlowTest'));
        })

        socket.on('KnopEncoderEnable', function () {
            nmeaFunc.enbleEncoder()
        })

        socket.on('KnopNMEA', function () {
            SocketApiDebug('85 NMEAknop bediend in client')
            stateManager.set('GUI.INFO', "KnopNMEA gedrukt");
            let current = stateManager.get('GUI.NMEA.state') || false;
            stateManager.set('GUI.NMEA.state', !current);
            if (stateManager.get('GUI.NMEA.state')) {
                nmeaFunc.startStream1(socket, stateManager, io.sockets)
            } else {
                nmeaFunc.stopStream1()
            }
        })

        socket.on('NMEAsource', function (choice) { //Keuzemenu NMEA bron1
            SocketApiDebug('96 NMEAsource = ' + choice)
            stateManager.set('GUI.INFO', "NMEAsource gekozen " + choice);
            stateManager.set('GUI.NMEA.choice', choice);

            if (choice === "GPS Simulatie") {
                socket.on('key', nmeaFunc.KeyReceived)
            } else if (choice === "GPS") {
                socket.on('key', socketFunc.KeyReceived);
            } else if (choice === "GPSudp Simulatie") {
                socket.on('key', nmeaFunc.KeyReceived)
            } else if (choice === "GPSudp") {
                socket.on('key', socketFunc.KeyReceived);
            }
        })

        socket.on('KnopMission', function () {
            let missionData = stateManager.get('mission.data');
            if (missionData && missionData.MissionPlan) {
                stateManager.set('GUI.contour.recList', missionData.MissionPlan.MowArea.contour);
            }
            let current = stateManager.get('GUI.mission.active') || false;
            stateManager.set('GUI.mission.active', !current);
        })

        socket.on('KnopAutosteer', function () {
            SocketApiDebug('KnopAutosteer gedrukt')
            let current = stateManager.get('GUI.Autosteer') || false;
            stateManager.set('GUI.Autosteer', !current);
        })

        socket.on('DriveEnable', function () {
            let current = stateManager.get('GUI.driveEnable') || false;
            stateManager.set('GUI.driveEnable', !current);
        })

        // Overige events laten we voorlopig vallen of later migreren
    });

    return socketApi
}