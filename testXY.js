for(i=-250;i<250;i=i+10) {
    let maxSpeed = 100

    let X = i
    let Y = maxSpeed//s.autoMowSpeed
    var V = (250 - Math.abs(X)) * (Y / 250) + Y;
    var W = (250 - Math.abs(Y)) * (X / 250) + X;
    var LM = (V + W) / 2; // - 17;
    var RM = (V - W) / 2; // + 4;
    console.log("X= %s, V= %s, W= %s, LM= %s, RM= %s",X,V,W,LM,RM)
    correction = map_range(i, 250,-250,-maxSpeed,maxSpeed)
    LM = correction > 0 ? maxSpeed - correction : maxSpeed;
    RM = correction > 0 ? maxSpeed : maxSpeed + correction;
    console.log("LM= %s, RM= %s",LM, RM)
}
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  };