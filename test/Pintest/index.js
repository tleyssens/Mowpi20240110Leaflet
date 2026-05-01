const mower = require('./Mower')
let LM = 255
let RM = 255

mower.drive(255, 255)

setTimeout(test, 5000)

function test () {
	mower.drive(0, 0)
}
//pin22 geeft maar 0,16V meer als je ze aanstuurt = stuk
//motoren werken als generator misschien dat dat de oorzaak is?
// => Pin26 ipv 22 nemen
