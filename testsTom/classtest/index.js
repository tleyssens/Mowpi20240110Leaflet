let debugFormGPS = require('debug')('tom1:FormGPS')


const FormGPS = require("./formGPS")
//const ABLine = require('./TomABLine2')

let mf = new FormGPS()
debugFormGPS("mf %o", mf)
//debugFormGPS("AB %o", ABLine)

let ablin = mf.FormGPS()
debugFormGPS("ablin %s", ablin)
ablin.northing = 5
debugFormGPS("ablin %s", ablin)
