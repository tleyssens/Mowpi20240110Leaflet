var svgSpeed2 = d3.select("body")//targetheading
	.append("svg")
	.attr("id", "svg2")
	.style("position", "fixed")
	.style("left", "200px")
	.style("bottom", "10px")
	.attr("width", 160)
	.attr("height", 160)
	.append("g");
var centerX2 = 80;
var centerY2 = 80;
var path1 = [];
var path2 = [];
var start = 270; // °
var end = -10; // °
var startH = 0;
var endH = 9; //45
var stepH = 1; //5
var n = (endH - startH);
var angle = 0
var offset = 0
var pathsAway = 0
/*
function speedAngle(i) {
	return end + (Math.min(i, endH) - endH) / (startH - endH) * (start - end)
}
*/
var speed2 = 0;
var direction2 = svgSpeed2.append("path")
	.attr("d", [
		"M", Math.cos(Math.PI / 2 + Math.PI) * 5, -Math.sin(Math.PI / 2 + Math.PI) * 5,
		"L", Math.cos(Math.PI / 4 + Math.PI) * 25, -Math.sin(Math.PI / 4 + Math.PI) * 25,//was 15
		"L", Math.cos(Math.PI / 2) * 25, -Math.sin(Math.PI / 2) * 25,
		"L", Math.cos(-Math.PI / 4) * 25, -Math.sin(-Math.PI / 4) * 25,
		"Z"
	].join(" "))
	.style("transform", "translate(" + centerX2 + "px," + centerY2 + "px)")
	.attr("fill", "#0C0")
	.attr("stroke", "none");

var textAngle = svgSpeed2.append("text")
	.attr("x", 90)
	.attr("y", 115)
	.attr("font-size", "10px")
	.attr("fill", "green")
	.text(angle);

var textOffset = svgSpeed2.append("text")
	.attr("x", 80)
	.attr("y", 40)
	.attr("font-size", "10px")
	.attr("fill", "black")
	.text(offset)

svgSpeed2.append("text")
	.attr("x", 110)
	.attr("y", 40)
	.attr("font-size", "8px")
	.text("path")
var textPathsAway = svgSpeed2.append("text")
	.attr("x", 115)
	.attr("y", 50)
	.attr("font-size", "10px")
	.attr("fill", "black")
	.text(pathsAway)

function updateSpeed2(targetHeading, offset, pathsAway) { //targetHeading ontvangen 
	textAngle.text(targetHeading)
	textOffset.text(offset)
	textOffset.attr("x", (162 - textOffset.node().getComputedTextLength()) / 2);
	textPathsAway.text(pathsAway)

	direction2
		.style("transform", "translate(" + centerX2 + "px," + centerY2 + "px)rotate(" + targetHeading + "deg)")

}