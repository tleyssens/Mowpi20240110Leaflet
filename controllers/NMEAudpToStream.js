let debugTom = require('debug')('tom:NMEAudpTom')
const udp = require("dgram");

const  udpClientGPS = udp.createSocket("udp4")

const { Readable } = require('stream');

class BufferStream extends Readable {
    constructor ( buffer ){
        super();
        this.buffer = buffer;
    }

    _read (){
        this.push( this.buffer );
        this.push( null );
    }
}

init()
function init() {
    udpClientGPS.on("error", function (error) {
        console.log("Error: " + error);
        udpClientGPS.close();
    });
    udpClientGPS.on("message", async (buffer, info) => {
        const data = String(buffer)
        // console.log(
        //     "Received %d bytes from %s: %d\n data: \n",
        //     buffer.length,
        //     info.address,
        //     info.port,
        //     data
        // );
        return bufferToStream(buffer)
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

function bufferToStream( buffer ) {
    return new BufferStream( buffer );
}

//nmea = new BufferStream()
//console.log(util.inspect(nmea, true, 3, true))

module.exports = BufferStream