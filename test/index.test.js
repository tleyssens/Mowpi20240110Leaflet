//const split = require("split");

const assert = require('assert').strict

let nmeaUdpSimStream, nmeaUdpSim,split
let stream
describe('NMEAudpSimTom', function() {
    before(() => {
        nmeaUdpSim = require('../controllers/NMEAudpSimTom.js')
        split = require("split");
    })
    it('should be able to create a new readable stream', function() {
        nmeaUdpSimStream = new nmeaUdpSim(200)
        console.log('stream started')
        assert.equal(nmeaUdpSimStream.time, 200)
    });
    
    it('should be able to get data from stream', function(done) {
        let line =""
        stream = nmeaUdpSimStream.pipe(split("\r\n"));
        stream.once('data', function (data) {
            line = data
            console.log(line)
            assert.ok(line.indexOf("PANDA") !== -1)
            done()
        })
    });

    it('should be able to stop the stream', function() {
        stream.on("end", function () {
            console.log("All the data has been read");
        })
        stream.on("close", function(err) {
            console.log("closed streamreader")
            assert.ok(true)
        })
        stream.destroy()
    })
})
// describe('NMEAclientUDP', function() {
//     it('should be able to read datastream from GPS', function() {

//     })
// })