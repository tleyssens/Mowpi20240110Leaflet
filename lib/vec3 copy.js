class vec2 {
	constructor(easting, northing, heading) {
	 this.easting = easting
	 this.northing = northing
	 this.heading = heading
	}
	vec3(easting, northing, heading) {
		this.easting = easting
		this.northing = northing
		this.heading = heading
	}
	GetLength() {
		return Math.sqrt((this.easting * this.easting) + (this.northing * this.northing) + (this.heading * this.heading))
	}
	HeadingXZ() {
    return Math.atan2(this.easting, this.northing);
  }
	
}
//test
//let x = new vec3(0,1,0.1)
//let y = new vec3(0,1,-0.1)
//console.log("x.length = %s , y.length = %s), x.GetLength(), y.GetLength())

//module.exports = vec3