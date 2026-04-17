//const conf = require("../data/config.json")
const udp = require("dgram");

const  udpClientGPS = udp.createSocket("udp4")

init()

function init() {
    udpClientGPS.on("error", function (error) {
        console.log("Error: " + error);
        udpClientGPS.close();
    });
    udpClientGPS.on("message", async (buffer, info) => {
        const data = String(buffer)
        console.log(
            "Received %d bytes from %s: %d\n data: \n",
            buffer.length,
            info.address,
            info.port,
            data
        );
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