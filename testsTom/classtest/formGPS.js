//const ABLine = require("../../lib/TomABLine");
let debugTomGPS = require("debug")("tom1:formGPSclass");

class FormGPS {
    ABLine = require("../../lib/TomABLine");

    FormGPS() 
    {
        let abline = new this.ABLine(this)
        debugTomGPS(abline)
        //return abline
    }
}
module.exports = FormGPS