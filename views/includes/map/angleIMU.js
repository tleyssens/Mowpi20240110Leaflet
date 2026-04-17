var svgAngleIMU = d3.select("body") //angleIMU arrow
	.append("svg")
	.attr("id", "svg4")
	.style("position", "fixed")
	.style("left", "280px")
	.style("bottom", "10px")
	.attr("width", 160)
	.attr("height", 160)
	.append("g");
var centerX4 = 80;
var centerY4 = 80;
var path1 = [];
var path2 = [];
var start = 270; // °
var end = -10; // °
var startH = 0;
var endH = 9; //45
var stepH = 1; //5
var n = (endH - startH);
var angleIMU = 0

/*
function speedAngle(i) {
	return end + (Math.min(i, endH) - endH) / (startH - endH) * (start - end)
}
*/
//var speed3 = 0;
var textValue = svgAngleIMU.append("text")
	.attr("x", 80)
	.attr("y", 50)
	.attr("font-size", "10px")
	.attr("fill", "black")
	.text(angleIMU)

var angleI = svgAngleIMU.append("path")
	.attr("d", [
		"M", Math.cos(Math.PI / 2 + Math.PI) * 5, -Math.sin(Math.PI / 2 + Math.PI) * 5,
		"L", Math.cos(Math.PI / 4 + Math.PI) * 10, -Math.sin(Math.PI / 4 + Math.PI) * 10, //was 15
		"L", Math.cos(Math.PI / 2) * 10, -Math.sin(Math.PI / 2) * 10,
		"L", Math.cos(-Math.PI / 4) * 10, -Math.sin(-Math.PI / 4) * 10,
		"Z"
	].join(" "))
	.style("transform", "translate(" + centerX4 + "px," + centerY4 + "px)")
	.attr("fill", "#00f")
	.attr("stroke", "none");

function updateAngleIMU(angleIMU) { //	angleIMU ontvangen 
	//console.log ('in UpdateAngleIMU'+ angleIMU);
	angleI
		.style("transform", "translate(" + centerX4 + "px," + centerY4 + "px)rotate(" + angleIMU + "deg)")
	textValue.text(angleIMU.toFixed(2))
}