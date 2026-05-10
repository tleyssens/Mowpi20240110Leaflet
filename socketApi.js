module.exports = function (stateManager) { //Tom: bijgezet - nu StateManager i.p.v. plain s
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
        // ... (sensor code blijft hetzelfde)
    }

    function getAngle() {
        // ... (bestaande logica)
        stateManager.set('GUI.angleIMU', angle);
    }

    io.on('connection', function (socket) {
        SocketApiDebug(' *** A user connected:  Mes = %s, PID = %s', stateManager.get('GUI.MaaiMES'), process.pid)
        socket.emit('state', stateManager.get('GUI'))

        socket.on('KnopMes', function () {
            SocketApiDebug('Mesknop bedient in client')
            let current = stateManager.get('GUI.MaaiMES');
            stateManager.set('GUI.MaaiMES', !current);
            mower.setMes(stateManager.get('GUI.MaaiMES'));
            // emit gebeurt automatisch via StateManager
        })

        // Andere knoppen blijven voorlopig met s, maar we kunnen ze later migreren
        // Voor nu houden we zoveel mogelijk backward compat

        // ... (rest van de socket handlers blijven grotendeels hetzelfde, met stateManager waar eenvoudig)

        socket.on('KnopAutosteer', function () {
            SocketApiDebug('KnopAutosteer gedrukt')
            let current = stateManager.get('GUI.Autosteer');
            stateManager.set('GUI.Autosteer', !current);
        });

        // TODO: meer events migreren in volgende stappen

    });

    return socketApi
}