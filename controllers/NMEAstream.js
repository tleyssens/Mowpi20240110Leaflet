let NMEAstreamDebug = require('debug')('tom1:NMEAstream')
const split = require('split')
//const serialPort = require('serialport') //werkt

const SerialPort = require('@serialport/stream') //test op windows
//const Binding = require('@serialport/bindings')
//const readLine = require('@serialport/parser-readline') //werkt ook
const nmeaSim = require('./NMEAsimTom.js')
const nmeaPandaSim = require('./NMEApandaSimTom.js')
//const udpStream = require('./NMEAudpToStream.js')
//const GPSudpDatagram = require('./NMEAdatagram')
const {
    exec
} = require('child_process');
const {
    spawn
} = require("child_process");

const util = require("util");
const execProm = util.promisify(exec);
const net = require('net');
const client = new net.Socket();
let port
let nmeaSimStream
let nmeaPandaSimStream

exports.getStream = function (choice) {
    switch (choice) {
        case "GPS":
            NMEAstreamDebug('get seriele poortstream')
            if (typeof port === 'undefined') {
                NMEAstreamDebug('port undefined, using serial0')
                port = new SerialPort('/dev/serial0', {
                    baudRate: 115200
                })
            }
            return port
        case "GPSudp":
            NMEAstreamDebug('Get udp-stream van TeensyGPS')
            if (typeof GPSudpStream === 'undefined') {
               //GPSudpStream = new udpStream()
               //GPSudp = GPSudpDatagram.init()
            }
            return GPSudp
        case "GPS Simulatie":
            NMEAstreamDebug("get GPS simulatiestream")
            if (typeof nmeaSimStream === 'undefined') {
                nmeaSimStream = new nmeaSim(200)
            } else {
                NMEAstreamDebug('nmeaGPSSimStream niet gestart')
            }
            return nmeaSimStream
        case "GPSudp Simulatie":
            NMEAstreamDebug("get udp simulatiestream")
            if (typeof nmeaPandaSimStream === 'undefined') {
                nmeaPandaSimStream = new nmeaPandaSim(400)
                NMEAstreamDebug('nmeaUdpSimStream gestart')
            } else {
                NMEAstreamDebug('nmeaUdpSimStream niet gestart')
            }
            return nmeaPandaSimStream
        case "File":
            NMEAstreamDebug("get filestream")
            var os = new os_func();
            os.execCommand('pkill -9 str2str', function (returnvalue) {
                NMEAstreamDebug('pkill str2str: ' + returnvalue)
            });
            os.execCommand('../rtk/str2str -in ../rtk/LogThuis1.ntrip::T::x1::+330 -out tcpsvr://:52000', function (returnvalue) {});
            client.connect(52000, '127.0.0.1', function () {
                NMEAstreamDebug('nmea-client connected');
            });
            return client
        default:
            return 'alert'
    }
}

function os_func() {
    this.execCommand = function (cmd, callback) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                NMEAstreamDebug('error str2str' + err);
                return;
            }
            callback(stdout);
        });
    };
};

function startNtrip() {
    NMEAstreamDebug('ntrip starten')
    const {
        execFile
    } = require('child_process');
    const child = execFile('./startFlepos.sh', [], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
    });
    NMEAstreamDebug(child.pid)
    return (child.pid)
}

async function run_shell_command(command) {
    let result;
    NMEAstreamDebug('in run shell command : ' + command)
    try {
        result = await execProm(command);
    } catch (ex) {
        result = ex;
    }
    if (Error[Symbol.hasInstance](result))
        return;

    return result;
}