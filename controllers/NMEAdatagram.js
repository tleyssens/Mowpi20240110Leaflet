let debugTom = require('debug')('tom:NMEAudpTom')
const udp = require("dgram");

const  udpClientGPS = udp.createSocket("udp4")

let lastData = "",
    lastUpdate

module.exports = {
    init: (socket, config) => {
        console.log("Accessing GPS data over UDP");
        initiate(socket, config)
    }
}

init()
function init(socket, config) {
    udpClientGPS.on("error", function (error) {
        console.log("Error: " + error);
        udpClientGPS.close();
    });
    udpClientGPS.on("message", async (buffer, info) => {
        const data = String(buffer)
        if (data != lastData) {
            // console.log(
            //     "Received %d bytes from %s: %d\n data: \n",
            //     buffer.length,
            //     info.address,
            //     info.port,
            //     data
            // );
            dispatch(data, socket)
        }
        lastData = data

    })
    udpClientGPS.on("listening", function () {
        var address = udpClientGPS.address();
        var port = address.port;
        var family = address.family;
        var ipaddr = address.address;
        console.log("Server is listening at port " + port);
        console.log("Server ip :" + ipaddr);
        console.log("Server is IP4/IP6 : " + family);
    });
    
    //emits after the socket is closed using socket.close();
    udpClientGPS.on("close", function () {
        console.log("Socket is closed !");
    });
    udpClientGPS.bind(9999);

}
function dispatch(data, socket) {
    console.log("in dispatch in ntripStream.js : "+ data.toString())
    if (JSON.stringify(data) != JSON.stringify(lastUpdate)) {
        socket.emit("telemetry", data.toString())
        //lastUpdate = data
    }
}

//console.log(util.inspect(nmea, true, 3, true))