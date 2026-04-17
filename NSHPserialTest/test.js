"use strict"
const serialPort = require('serialport') //werkt
const SerialPort = require('@serialport/stream')
//const Binding = require('@serialport/bindings')
const readLine = require('@serialport/parser-readline')

const port = new SerialPort ('/dev/ttyUSB1', {
                baudRate: 115200
})
var stream = port.pipe(new readLine({
                                    delimiter: '\r\n',
                                        encoding: 'utf8'
        }))
//var stream = port.pipe(split('\n'))
stream.on('data', line => console.log(`> ${line}`))