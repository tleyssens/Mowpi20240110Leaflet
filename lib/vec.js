class vec2 {
	constructor(easting, northing) {
	 this.easting = easting
	 this.northing = northing
	}
	vec2(easting, northing) {
		this.easting = easting
		this.northing = northing
	}
	GetLength() {
		return Math.sqrt((easting * easting) + (northing * northing))
	}
	
}
//let x = new vec2(3,2)
//console.log(x.GetLength())
module.exports = vec2