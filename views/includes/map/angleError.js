var svgAngleError = d3.select("body")//angleError arrow
	.append("svg")
	.attr("id", "svg3")
	.style("position", "fixed")
	.style("left", "250px")
	.style("bottom", "10px")
	.attr("width", 160)
	.attr("height", 160)
	.append("g");
var centerX3 = 80;
var centerY3 = 80;
var path1 = [];
var path2 = [];
var start = 270; // °
var end = -10; // °
var startH = 0;
var endH = 9; //45
var stepH = 1; //5
var n = (endH - startH);
/*
function speedAngle(i) {
	return end + (Math.min(i, endH) - endH) / (startH - endH) * (start - end)
}
*/
//var speed3 = 0;
var angle = svgAngleError.append("path")
	.attr("d", [
		"M", Math.cos(Math.PI / 2 + Math.PI) * 5, -Math.sin(Math.PI / 2 + Math.PI) * 5,
		"L", Math.cos(Math.PI / 4 + Math.PI) * 10, -Math.sin(Math.PI / 4 + Math.PI) * 10,//was 15
		"L", Math.cos(Math.PI / 2) * 10, -Math.sin(Math.PI / 2) * 10,
		"L", Math.cos(-Math.PI / 4) * 10, -Math.sin(-Math.PI / 4) * 10,
		"Z"
	].join(" "))
	.style("transform", "translate(" + centerX3 + "px," + centerY3 + "px)")
	.attr("fill", "#000")
	.attr("stroke", "none");
function updateAngleError(angleError) { //targetHeading ontvangen 
	//console.log ('in UpdateAngleError'+ angleError);
	angle
		.style("transform", "translate(" + centerX3 + "px," + centerY3 + "px)rotate(" + angleError + "deg)")
}