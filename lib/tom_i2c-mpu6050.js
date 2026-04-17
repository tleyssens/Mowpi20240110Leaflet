var tom_MPU6050 = require('i2c-mpu6050')
var POWER_MGMT_1 = 0x6b


tom_MPU6050.prototype.writeWord = function (reg, data) {
	console.log("test")

}
tom_MPU6050.prototype.reset = function (address) {
	this.address = address;
	console.log("reset")
	this.bus.writeByteSync(address, POWER_MGMT_1, 0x80) // the bit will autoclear =  springt terug op 0
}
tom_MPU6050.prototype.tCalibrateAccel = function (address) {
	this.address = address;
	console.log("calibrate Accel")
	let acc_x_bias = this.readWordSync(0x77) >> 1
	let acc_y_bias = this.readWordSync(0x7A) >> 1
	let acc_z_bias = this.readWordSync(0x7D) >> 1
	console.log(acc_x_bias)
	//let acc_x =
	//this.bus.writeByteSync(address, POWER_MGMT_1, 0x80) // the bit will autoclear =  springt terug op 0
}
tom_MPU6050.prototype.tCalibrateGyro = function (address) {
	this.address = address;
	console.log("calibrate Gyro")
	let acc_x_bias = this.readWordSync(0x77) >> 1
	let acc_y_bias = this.readWordSync(0x7A) >> 1
	let acc_z_bias = this.readWordSync(0x7D) >> 1
	console.log(acc_x_bias)
	//let acc_x =
	//this.bus.writeByteSync(address, POWER_MGMT_1, 0x80) // the bit will autoclear =  springt terug op 0
}
module.exports = tom_MPU6050