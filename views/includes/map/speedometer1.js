
var svgSpeed1 = d3.select("body")//heading
	.append("svg")
	.attr("id", "svg1")
	.style("position", "fixed")
	.style("left", "200px")
	.style("bottom", "10px")
	.attr("width", 160)
	.attr("height", 160)
	.append("g");
var centerX = 80;
var centerY = 80;
var path1 = [];
var path2 = [];
var start = 270; // °
var end = -10; // °
var startH = 0;
var endH = 9; //45
var stepH = 1; //5
var n = (endH - startH);

function speedAngle(i) {
	return end + (Math.min(i, endH) - endH) / (startH - endH) * (start - end)
}

for (var i = 0; i <= n; i++) {

	var alpha = (end + start - speedAngle(i)) / 180 * Math.PI;
	var path = path2;
	var r = 4;

	if (i % 5 === 0) {

		path = path1;
		r = 7;
		svgSpeed1.append("text")
			.attr("x", Math.cos(alpha) * 60 + centerX - 5)
			.attr("y", -Math.sin(alpha) * 60 + centerY + 5)
			.attr("font-weight", "bold")
			.attr("font-size", "10px")
			.text(endH - i);
	}

	path.push("M");
	path.push(Math.cos(alpha) * (r + 70) + centerX);
	path.push(-Math.sin(alpha) * (r + 70) + centerY);
	path.push("L");
	path.push(Math.cos(alpha) * 70 + centerX);
	path.push(-Math.sin(alpha) * 70 + centerY);
}

function arc(x, y, radius, startAngle, endAngle) {
	var start = {
		x: x + (radius * Math.cos(endAngle * Math.PI / 180)),
		y: y - (radius * Math.sin(endAngle * Math.PI / 180))
	};

	var end = {
		x: x + (radius * Math.cos(startAngle * Math.PI / 180)),
		y: y - (radius * Math.sin(startAngle * Math.PI / 180))
	};

	var a = (startAngle - endAngle) > 180 ? 1 : 0;
	return [
		"M", start.x, start.y,
		"A", radius, radius, 0, a, 0, end.x, end.y
	].join(" ");
}

var speed1 = 0;
var angle1 = 0

var shadowSpeed1 = svgSpeed1.append("path")
	.attr("d", arc(centerX, centerY, 72, start, speedAngle(speed1)))
	.attr("fill", "none")
	.style("stroke-width", "3")
	.attr("stroke", "rgba(0, 220, 255, 0)");

svgSpeed1.append("path")
	.attr("d", path1.join(" "))
	.attr("fill", "none")
	.style("stroke-width", "2")
	.attr("stroke", "black");

svgSpeed1.append("path")
	.attr("d", path2.join(" "))
	.attr("fill", "none")
	.attr("stroke", "black");

var direction1 = svgSpeed1.append("path")
	.attr("d", [
		"M", Math.cos(Math.PI / 2 + Math.PI) * 5, -Math.sin(Math.PI / 2 + Math.PI) * 5,
		"L", Math.cos(Math.PI / 4 + Math.PI) * 15, -Math.sin(Math.PI / 4 + Math.PI) * 15,
		"L", Math.cos(Math.PI / 2) * 20, -Math.sin(Math.PI / 2) * 20,
		"L", Math.cos(-Math.PI / 4) * 15, -Math.sin(-Math.PI / 4) * 15,
		"Z"
	].join(" "))
	.style("transform", "translate(" + centerX + "px," + centerY + "px)")
	.attr("fill", "#c00")
	.attr("stroke", "none");

var circleSpeed1 = svgSpeed1.append("circle")
	.attr("r", 4)
	.attr("cx", Math.cos(speedAngle(speed1) / 180 * Math.PI) * 72 + centerX)
	.attr("cy", -Math.sin(speedAngle(speed1) / 180 * Math.PI) * 72 + centerY)
	.attr("fill", "white")
	.style("stroke-width", 2)
	.attr("stroke", "black");

var textSpeed1 = svgSpeed1.append("text")
	.attr("x", 90)
	.attr("y", 140)
	.attr("font-weight", "bold")
	.attr("font-size", "30px")
	.attr("fill", "black")
	.text(speed1);

var textAngle1 = svgSpeed1.append("text")
	.attr("x", 40)
	.attr("y", 115)
	.attr("font-size", "10px")
	.attr("fill", "red")
	.text(angle1);

svgSpeed1.append("text")
	.attr("x", 95)
	.attr("y", 155)
	.attr("font-weight", "bold")
	.attr("font-size", "13px")
	.attr("fill", "black")
	.text("mpm");

svgSpeed1.append("text")
	.attr("x", centerX - 30 - 4)
	.attr("y", centerY + 4)
	.attr("font-weight", "bold")
	.attr("font-size", "13px")
	.attr("fill", "black")
	.text("W");

svgSpeed1.append("text")
	.attr("x", centerX + 30 - 4)
	.attr("y", centerY + 4)
	.attr("font-weight", "bold")
	.attr("font-size", "13px")
	.attr("fill", "black")
	.text("E");

svgSpeed1.append("text")
	.attr("x", centerX - 4)
	.attr("y", centerY - 30 + 3)
	.attr("font-weight", "bold")
	.attr("font-size", "13px")
	.attr("fill", "black")
	.text("N");

svgSpeed1.append("text")
	.attr("x", centerX - 4)
	.attr("y", centerY + 30 + 7)
	.attr("font-weight", "bold")
	.attr("font-size", "13px")
	.attr("fill", "black")
	.text("S");

function updateSpeed(speed1, bearing) { //gpsdata ontvangen 
	console.log("speed1 = "+ speed1)
	//let svgSpeed1 = d3.select("#svg1");
	//te = t1 - Date.now();
	//t1 = Date.now();
	//var speed1 = data.speed;
	//console.log(speed1 + " " + bearing)
	textSpeed1.text(speed1 + 'm');
	textAngle1.text(bearing)
	
	direction1
		.style("transform", "translate(" + centerX + "px," + centerY + "px)rotate(" + bearing + "deg)")

	circleSpeed1
		.attr("cx", Math.cos(speedAngle(speed1) / 180 * Math.PI) * 72 + centerX)
		.attr("cy", -Math.sin(speedAngle(speed1) / 180 * Math.PI) * 72 + centerY);

	shadowSpeed1
		.attr("d", arc(centerX, centerY, 72, start, speedAngle(speed1)))
		.attr("stroke", "rgba(0, 220, 255, " + (speed1 / (endH - startH)) + ")");
}