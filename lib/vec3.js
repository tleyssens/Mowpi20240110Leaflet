class vec3 {
  constructor(easting, northing, heading) {
    this.easting = easting;
    this.northing = northing;
    this.heading = heading;
  }
  vec3(easting, northing, heading) {
    this.easting = easting;
    this.northing = northing;
    this.heading = heading;
  }
  GetLength() {
    return Math.sqrt(
      this.easting * this.easting +
        this.northing * this.northing +
        this.heading * this.heading
    );
  }
  Normalize() {
    let length = this.GetLength();
    if (Math.abs(length) < 0.0000000000001) {
      throw new Error(
        message,
        "Trying to normalize a vector with length of zero."
      );
    }
    this.easting /= length;
    this.northing /= length;
    this.heading /= length;
    return this;
  }
  GetLengthSquared() {
    return (
      this.easting * this.easting +
      this.heading * this.heading +
      this.northing * this.northing
    );
  }
  HeadingXZ() {
    return Math.atan2(this.easting, this.northing);
  }
}
//test
//  let x = new vec3(5,4,0.1)
//  let y = new vec3(1,-1,-0.1)
//  console.log("x.length = %s , y.length = %s", x.GetLength(), y.GetLength())
// console.log("heading x = %s, heading y = %s", x.HeadingXZ(), y.HeadingXZ())
// console.log("normalized x = %s", x.Normalize().GetLength())
class vecFix2Fix {
  constructor(easting, distance, northing, isSet) {
    if (distance == undefined) {
      let n = easting;
      let arr = new Array(n);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = new vecFix2Fix(0, 0, 0, 0);
      }
      return arr;
    } else {
      this.easting = easting; //easting
      this.distance = distance; //distance since last point
      this.northing = northing; //norting
      this.isSet = isSet; //altitude
    }
  }
  vecFix2Fix(_easting, _northing, _distance, _isSet) {
    this.easting = _easting;
    this.distance = _distance;
    this.northing = _northing;
    this.isSet = _isSet;
  }
  //pop() {console.log('arraylength')}
}
//test
// console.log("5")
// let z = new vecFix2Fix(5)
// z[2].distance = 7
// console.log("z.distance = %s",z[2].distance)

class vec4 {
  constructor(easting, heading, northing, index) {
    this.easting = easting; //easting
    this.heading = heading; //heading etc
    this.northing = northing; //northing
    this.index = index; //altitude
  }
  vec4(_easting, _northing, _heading, _index) {
    this.easting = _easting;
    this.heading = _heading;
    this.northing = _northing;
    this.index = _index;
  }
}
class vec2 {
  constructor(easting, northing) {
    this.easting = easting;
    this.northing = northing;
  }
  HeadingXY() {
    return Math.atan2(this.easting, this.northing);
  }
  GetLength() {
    return Math.sqrt(
      this.easting * this.easting + this.northing * this.northing
    );
  }
  Normalize() {
    let length = this.GetLength();
    if (Math.abs(length) < 0.0000000000001) {
      throw new Error(
        message,
        "Trying to normalize a vector with length of zero."
      );
    }
    this.easting /= length;
    this.northing /= length;
    return this;
  }
}

module.exports = {
  vec3,
  vecFix2Fix,
  vec4,
  vec2,
};
