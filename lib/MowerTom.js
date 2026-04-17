class MowerTom {
	constructor() {
		//var Gpio = require('pigpio').Gpio,
		this.simulatie = false // dit moet je vanaf nu herzetten op false anders worden de motoren niet aangestuurd
		this.state = "ready"
		/*this.mes = new Gpio(18, {
			mode: Gpio.OUTPUT
		})*/
	}
	drive(LM, RM) {
			if(!this.simulatie) {
				SendSpiCMD(1,parseInt(LM),parseInt(RM)); //rijden
			}
			this.state = "driving"
			console.log('vanuit Mower class:  LM: %s, RM: %s',LM,RM)
	}
	stop() {
		SendSpiCMD(1,0,0)	
		this.state = "stopped"
		//console.log('vanuit Mower class: stopped')
	}
	cleanup() {

	}
	setMes(state) {
		this.mes = state	
	}
	setTarget(point) {
		this.target.lat = point.lat
		this.target.lon = point.lon
		this.state = "driveToTarget"
	}
	getState() {
		return this.state 
	}
	doUturn(side) {
		if (side === "R") {
			this.drive()
		}
	}
	enableEncoder() {
		SendSpiCMD(3, 0, 0); // motorsnelheid geregeld met encoder en pid
	}
}
	function SendSpiCMD(CMD, TR1, TR2) {  
		const spi = require('spi-device')
		const buffer = new ArrayBuffer(6)
		const SpiArray = new Int16Array(buffer)
		const dview = new DataView(buffer)
		dview.setInt16(0,CMD)
		dview.setInt16(2,TR1)
		dview.setInt16(4,TR2)
		console.log(Buffer.from(SpiArray.buffer));
		// An SPI message is an array of one or more read+write transfers
		const message = [{
			sendBuffer: Buffer.from(SpiArray.buffer), // Sent
			receiveBuffer: Buffer.alloc(6),              // Raw data read
			byteLength: 6,
			speedHz: 200000 // Use a low bus speed
		}];
		const T3_2 = spi.open(0, 0, err => {
			if (err) throw err;
			T3_2.transfer(message, (err, message) => {
			if (err) throw err;
			//console.log(message[0]);
			//console.log(message[1]);
			// Convert raw value from sensor to celcius and log to console
			//const rawValue = ((message[0].receiveBuffer[1] & 0x03) << 8) +
			// message[0].receiveBuffer[2];
			//const voltage = rawValue * 3.3 / 1023;
			//const celcius = (voltage - 0.5) * 100;
			//console.log("recieve" + message[0].receiveBuffer[0] + "; " + message[0].receiveBuffer[1] + "; " + message[0].receiveBuffer[2]+ "; " + message[0].receiveBuffer[3])
			//console.log(rawValue);
			})
		})
	}
module.exports = new MowerTom()