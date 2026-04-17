"use strict";

//const conf = require("../data/config.json")
var udp = require("dgram");

var udpClientGPS = udp.createSocket("udp4");
init();

function init() {
  udpClientGPS.on("error", function (error) {
    console.log("Error: " + error);
    udpClientGPS.close();
  });
  udpClientGPS.on("message", function _callee(buffer, info) {
    var data;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = String(buffer);
            console.log("Received %d bytes from %s: %d\n data: \n", buffer.length, info.address, info.port, data);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  udpClientGPS.on("listening", function () {
    var address = udpClientGPS.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log("Server is listening at port " + port);
    console.log("Server ip :" + ipaddr);
    console.log("Server is IP4/IP6 : " + family);
  }); //emits after the socket is closed using socket.close();

  udpClientGPS.on("close", function () {
    console.log("Socket is closed !");
  });
  udpClientGPS.bind(9999);
}