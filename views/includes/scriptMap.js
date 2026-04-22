var p = 0;
var t1, te;
var socket = io();
var startTime;
var markers = [0,0];
var down = 0;
var joystick	= new VirtualJoystick({
    container	: document.getElementById('containerMain'),
    strokeStyle : 'green',
    mouseSupport	: true,
    limitStickTravel: true,
    stickRadius		: 125,
    stationaryBase : true,
    //useCssTransform : true,
    baseX: document.getElementById('containerMain').clientWidth/2,
    baseY: document.getElementById('containerMain').clientHeight/2
});

joystick.addEventListener('touchStart', function(){
    //console.log('down')
    down = 1;
})
joystick._container.addEventListener("mousedown", function(){
    //console.log('down')
    down = 1;
})
joystick.addEventListener('touchEnd', function(){
    //console.log('up')
    down = 0;
})
joystick._container.addEventListener('mouseup', function(){
    //console.log('up')
    down = 0;
})
var speedSlider = document.getElementById("SpeedSlider")
var speedOutput = document.getElementById("SpeedSliderValue")

speedOutput.innerHTML = speedSlider.value
speedSlider.oninput = function () {
    speedOutput.innerHTML = this.value
    socket.emit("key", {
        Key: "SpeedSliderValue",
        value: this.value
    })
}
var pslider = document.getElementById("Pslider");
var poutput = document.getElementById("Pvalue");
poutput.innerHTML = pslider.value / 1000;
pslider.oninput = function () {
    poutput.innerHTML = this.value / 1000;
    socket.emit('key', {
        Key: 'Pvalue',
        value: this.value / 1000
    });
}
var islider = document.getElementById("Islider");
var ioutput = document.getElementById("Ivalue");
ioutput.innerHTML = islider.value / 1000;
islider.oninput = function () {
    ioutput.innerHTML = this.value / 1000;
    socket.emit('key', {
        Key: 'Ivalue',
        value: this.value / 1000
    });
}
var dslider = document.getElementById("Dslider");
var doutput = document.getElementById("Dvalue");
doutput.innerHTML = dslider.value / 1000;
dslider.oninput = function () {
    doutput.innerHTML = this.value / 1000;
    socket.emit('key', {
        Key: 'Dvalue',
        value: this.value / 1000
    });
}

var pureSlider = document.getElementById("pureSlider");
var pureOutput = document.getElementById("pureValue");
pureOutput.innerHTML = pureSlider.value / 1000;
pureSlider.oninput = function () {
    pureOutput.innerHTML = this.value / 1000;
    socket.emit('key', {
        Key: 'pureValue',
        value: this.value / 1000
    });
}

var trackPath,
    trajectPath = [];

let prevFutureMarker = null
let prevTargetpointMarker = null
let prevPpCircle = null
let ppCircles = null
let prevGpCircle = null

function initMap() { //wordt gestart vanuit maplayout.pug (callback=initMap)
    console.log('in initMap in scriptMap.js' + markers)
    var alpha = 0.4; // smoothing factor

    /*var state = {
        // thuis        
        lat: 50.996328561666665,
        lng: 5.388168066666666
        //Pa
        //lat: 51.05034169,               lng: 5.30504305
    };*/
    let mapLocation = [50.996328561666665, 5.388168066666666]

    //console.log(s)
    console.log(mapLocation)
    //var state = {lat: 51.05033956456792, lng: 5.304905256533743}; //PA
    var b = 0;

    map = L.map('map', {center: mapLocation, zoom: 20, minZoom: 4, maxZoom: 25})

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		maxNativeZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

    var prevQuality = '';

    /*map.addListener('click', function (e) {
        console.log('        clickTarget value e')
        console.log(JSON.stringify(e, null, 4)); // (Optional) beautiful indented output.
        placeMarker(e.latLng, map, '');
        socket.emit('key', {
            Key: 'clickTarget',
            value: e
        });
        waypoint.waypointdata = e.latLng
        console.log('LatLng emit to server');
    });*/
    map.on('click', function(e) {   //2024 OK
        waypoint.waypointdata = e.latlng
        console.log('click'+ e.latlng)   
        placeMarker(e.latlng, map, '')
        socket.emit('key', {
            Key: 'clickTarget',
            value: e.latlng
        });
        console.log('LatLng emit to server');
    })

    //let latlng = L.latLng(50.5, 30.5); // leaflet

////let lineAB = L.polyline([], {color: 'blue', weight: 3})2014
    /*var line = new google.maps.Polyline({
        map: map,
        icons: [{
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: '#ff0000',
                fillColor: '#ff0000',
                fillOpacy: 0.5,
                //scale: 5
            },

            repeat: '100px',
            path: []
        }],
        strokeWeight: 1,
        strokeColor: '#ff0000',
    });*/
    let line = L.polyline([], {color: 'red', weight: 3});
    /**var line1 = new google.maps.Polyline({
        map: map,
        icons: [{
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: '#00ff00',
                fillColor: '#00ff00',
                fillOpacy: 0.5,
                //scale: 5
            },
            repeat: '100px',
            path: []
        }],
        strokeWeight: 1,
        strokeColor: '#00ff00',
    });**/
    let line1 = L.polyline([], {color: 'green'})

    var missionLine = L.polyline([], {color: '#FFFF00', weight: 3})

    $("#draw a").click(function (e) {
        //	 e.preventDefault();
        console.log("draws");

        disable()

        // google.maps.event.addDomListener(map.getDiv(), 'mousedown', function (e) {
        //     console.log('in mousedown');
        //     drawFreeHand()
        //});

    });
    socket.on('zetBeginpunt'), function(pos) {
        zetBeginpunt(pos)
    }
    //io.sockets.on('position', function (pos) {
    
    /*socket.on('position', function (pos) {
        //20201019
        //****rode pijl 
        //console.log(pos)
        state.lat = pos.lat; //Echte waardes
        state.lng = pos.lon;
        if (pos.quality != prevQuality) {
            console.log('quality = ' + pos.quality);
            prevQuality = pos.quality
        }
        var path = line.getPath().getArray(),
            latLng = new google.maps.LatLng(state.lat, state.lng);
        path.push(latLng);
        // path beperken
        if (path.length > 400) {
            path.shift();
        };
        line.setPath(path);
        //map.setCenter(latLng);
        //new google.maps.Marker({map:map,position:latLng});

        //waardes kalman //**** groene pijl 
        state.lat = pos.position.pos[0]; //geschatte waardes kalman
        state.lng = pos.position.pos[1];
        var path1 = line1.getPath().getArray(),
            latLng = new google.maps.LatLng(state.lat, state.lng);
        path1.push(latLng);
        if (path1.length > 40) {
            path1.shift();
        };
        line1.setPath(path1);
    });*/
    socket.on('position', function (pos) {
        //ROOD
        //console.log('position', pos)
        if (pos.quality != prevQuality) {
            console.log('quality = ' + pos.quality);
            prevQuality = pos.quality
        }
        let point = [pos.lat,pos.lon]
        //console.log('point', point)
        line.addLatLng(point)
        line.addTo(map) 
        //GROEN waardes kalman //

    })
    socket.on('log', function (log) {
        console.log('serverLog: ' + JSON.stringify(log, null, 4));
    })
    socket.on('target', function (target) { //rood cirkeltje
        console.log('clientLog: target van server ontvangen= ' + JSON.stringify(target, null, 4));
        target.lng = target.lon;
        placeTargetpoint(target, map, target.n.toString());
    });
    socket.on('targetA', function (target) { //rood cirkeltje Array
        console.log('clientLog: targetA van server ontvangen= ' + JSON.stringify(target, null, 4));
        target.lat = target[0]
        target.lng = target[1]
        //target.lng = target.lon;
        //placeTargetpoint(target, map, target.n.toString());
        placeTargetpoint(target, map, target[2]);
    });
    socket.on('futurePoint', function (target) { //blauw kruisje Array
        console.log('clientLog: futurePoint van server ontvangen= ' + JSON.stringify(target, null, 4));
        target.lat = target[0]
        target.lng = target[1]
        placeFuturePoint(target, map, target[2]);
    });
    socket.on('traject', function (traject) {
        //console.log('traject van server ontvangen= ' + JSON.stringify(traject, null, 4));
        trajectPath = traject; //traject[0].lat
        ToonTraject()
    });
    socket.on('ABLijn', function (puntA, puntB) {
        console.log('ABLijn punt A : %s; punt B : %s',puntA, puntB)
        ////let path = lineAB.getPath().getArray()
        ////path.push(new google.maps.LatLng(puntA[0],puntA[1]))
        ////path.push(new google.maps.LatLng(puntB[0],puntB[1]))
        ////lineAB.setPath(path)
        let latlngs = [
            [puntA[0],puntA[1]],
            [puntB[0],puntB[1]]
        ]
        //let lineAB = 
        L.polyline(latlngs, {color: 'blue', weight: 3}).addTo(map)
        //lineAB.addLatLng([puntA[0],puntA[1]])
        //lineAB.addLatLng([puntB[0],puntB[1]])
        //lineAB.addTo(map)

    })
    socket.on('missionPath', function (input) { //20240114 OK
        console.log('missionPath van server ontvangen = ' + JSON.stringify(input, null, 4))

        for (var i = 0; i < input.length; i++) {
            //console.log('%s ; %s', input[i][0], input[i][1])
            missionLine.addLatLng([input[i][0], input[i][1]])
        }

        //console.log(JSON.stringify(path, null, 4))
        console.log(JSON.stringify(missionLine, null, 4))
        missionLine.addTo(map)
    })
    socket.on('contourPath', function (contourPath) {
        console.log('contourPath' + JSON.stringify(contourPath, null, 4))
    })
    socket.on('placeCircle', function(target, color) {
        if (color === "#FF0000") { 
            console.log('clientLog: rode PurePursuitCircle van server ontvangen= ' + JSON.stringify(target, null, 4));
        } else console.log('clientLog: groene gpCircle van server ontvangen= ' + JSON.stringify(target, null, 4));
        target.lat = target[0]
        target.lng = target[1]
        placeCircle(target, target[2],map, color)
    })    
    socket.on('RemoveMarkers', function() {
        hideMarkers();
        //markers = [];
    })

}

function placeTargetpoint(position, map, title) {
    //if(title == undefined)

    // var image = {
    //     url: 'trajectPoint.png', //rood cirkeltje
    //     // This marker is 7 pixels wide by 7 pixels high.
    //     size: new google.maps.Size(7, 7),
    //     origin: new google.maps.Point(0, 0),
    //     anchor: new google.maps.Point(5, 5)
    // };
    // var marker = new google.maps.Marker({
    //     position: position,
    //     map: map,
    //     icon: image,
    //     title: title
    // });
    // markers.push(marker);
    //setTimeout(removeMarker, 200, marker)
    //map.panTo(position);
    if (prevTargetpointMarker) {
        removeMarker(prevTargetpointMarker)
    }
    var image = L.icon({
        iconUrl: 'trajectPoint.png', // rood cirkeltje 7px * 7px
        className: "targetPoint",
        //shadowUrl: 'leaf-shadow.png',
        iconSize:     [5, 5], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [3, 3], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let marker = L.marker(position, {icon: image})
    marker.addTo(map);
    //console.log(markers)
    markers.push(marker)
    //console.log(markers)
    //setTimeout(removeMarker, 500, marker)
    prevTargetpointMarker = marker
}
function placeFuturePoint(position, map, title) {
    // var image = {
    //     url: 'futurePoint.png', //blauw kruisje
    //     // This marker is 7 pixels wide by 7 pixels high.
    //     size: new google.maps.Size(7, 7),
    //     origin: new google.maps.Point(0, 0),
    //     anchor: new google.maps.Point(5, 5)
    // };
    // var marker = new google.maps.Marker({
    //     position: position,
    //     map: map,
    //     icon: image,
    //     title: title
    // });
    // markers.push(marker);
    // //map.panTo(position);
    // setTimeout(removeMarker, 200, marker)
    if (prevFutureMarker) {
        removeMarker(prevFutureMarker)
    }
    //setMapOnAll(null); //20240121 laatste markers zichtbaar houden 
    var image = L.icon({
        iconUrl: 'futurePoint.png', //blauw kruisje
        // This marker is 7 pixels wide by 7 pixels high.
        className: "futurePoint",
        //shadowUrl: 'leaf-shadow.png',
        iconSize:     [5, 5], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [3, 3], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let marker = L.marker(position, {icon: image})
    marker.addTo(map);
    //console.log(markers)
    markers.push(marker)
    //console.log(markers)
    //setTimeout(removeMarker, 500, marker)
    prevFutureMarker = marker
}
function placeCircle(center, radius, map, color) {
    // const turningCircle = new google.maps.Circle({
    //     strokeColor: color,
    //     strokeOpacity: 0.8,
    //     strokeWeight: 1,
    //     //fillColor: "#FF0000",
    //     fillOpacity: 0,
    //     map: map,
    //     center: center,
    //     radius: radius
    //   });
    //   markers.push(turningCircle);
    //   setTimeout(removeMarker, 200, turningCircle)
    //console.log(`Center ${center}| Radius ${radius} | Color ${color}`)
   
    let circle = L.circle(center, {radius: Math.abs(radius), color:color, weight : 0.5, fill: false})
    circle.addTo(map) //, fill: false
    if (color === "#FF0000") {
        if (prevPpCircle) {
            removeMarker(prevPpCircle)
        }
        prevPpCircle = circle
        console.log('rood %s %O',radius, prevPpCircle)
    }
    if (color === "#00FF00") {
        if (prevGpCircle) {
            removeMarker(prevGpCircle)
        }
        prevGpCircle = circle
        console.log('groen %s %O',radius, prevGpCircle)
     }

}
// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function placeMarker(position, map, title) {
    let marker = L.icon({
        iconUrl: 'images/symbol_fore_close.png',
        iconSize: [38, 95],
        iconAnchor: [22, 94]
    })
    //L.marker(position, { icon: marker }).addTo(map);
    L.marker(position).addTo(map);
}
// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
    setMapOnAll(null);
}
function removeMarker(marker) {
    //console.log(marker)//marker.setMap(null)
    map.removeLayer(marker); // remove
}
function placeHeading(position, map, title, angle) {
    // var marker = new google.maps.Marker({
    //     position: position,
    //     map: map,
    //     title: title,
    //     icon: icon(BitmapDescriptorFactory.fromResource(R.mipmap.ic_arrow_up)),
    //     rotation: angle
    // });
    //map.panTo(position);

}
function drawFreeHand() {
    //the polygon
    var poly = new google.maps.Polyline({
        map: map,
        clickable: false
    });
    //move-listener
    var move = google.maps.event.addListener(map, 'mousemove', function (e) {
        poly.getPath().push(e.latlng);
    });
    //mouseup-listener
    /**google.maps.event.addListenerOnce(map, 'mouseup', function (e) {
        google.maps.event.removeListener(move);
        var path = poly.getPath();
        console.log('path = ' + JSON.stringify(path, null, 4));
        poly.setMap(null);
        poly = new google.maps.Polygon({
            map: map,
            path: path
        });
        google.maps.event.clearListeners(map.getDiv(), 'mousedown');
        enable()
        trackpath = path;
    });**/
    var newzoom = '' + (2*(mymap.getZoom())) +'px';
    $('#mapid .targetPoint').css({'width':newzoom,'height':newzoom});
}
function ToonTraject() {
    //socket.emit('ToonTraject');
    //console.log('ToonTraject Emit');
    console.log('in ToonTraject' + JSON.stringify(trajectPath, null, 4)); //traject[0].lat
    for (i = 0; i < trajectPath.length; i++) {
        console.log('ToonTraject ' + trajectPath[i])
        placeMarker(trajectPath[i], map, '[' + i.toString() + ']');
    }
}
function zetBeginpunt(position) {
    map.panTo(position);
}
function disable() {
    map.setOptions({
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: false
    });
}
function enable() {
    map.setOptions({
        draggable: true,
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true
    });
}


var width = 500;
var barHeight = 100;
var padding = 1;
var ctx = document.getElementById('myChart').getContext('2d');
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Snelheid',
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            data: []
        }, {
            label: 'Targetheading',
            borderColor: 'rgb(0, 255, 0)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            data: []
        }, {
            label: 'Heading',
            borderColor: 'rgb(0 ,125, 0)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            data: []
        }, {
            label: 'AngleError',
            borderColor: 'rgb(33, 0, 0)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            data: []
        }, {
            label: 'PIDout',
            borderColor: 'rgb(170,0,255)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            data: []
        }, {
            label: 'LM',
            borderColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            data: []
        }, {
            label: 'RM',
            borderColor: 'rgb(0, 0, 255)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            data: []
        }, {
            label: 'timer',
            borderColor: 'rgb(0, 255, 255)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            data: []
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    pause: false
                }
            }]
        },
        animation: {
            duration: 0 // general animation time//disable animations = tijdwinst 20201024
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item//disable animations = tijdwinst
        },
        responsiveAnimationDuration: 0 // animation duration after a resize//disable animations = tijdwinst
    }
}
var chart = new Chart(ctx, config)
setInterval(function(){
    if (down) {
        var outputEl	= document.getElementById('joystickResult');
        outputEl.innerHTML	= '<b>Result:</b> '
            + ' dx:'+  joystick.deltaX().toFixed(1)
            + ' dy:'+ -joystick.deltaY().toFixed(1)
            + (joystick.right()	? ' right'	: '')
            + (joystick.up()	? ' up'		: '')
            + (joystick.left()	? ' left'	: '')
            + (joystick.down()	? ' down' 	: '')	
        socket.emit('key', { Key: 'Steering', speed: -joystick.deltaY().toFixed(1)*2, steer: joystick.deltaX().toFixed(1)*2});
        //socket.emit('key', { Key: 'Steering', value: joystick.deltaX().toFixed(1)});
  //console.log('result ' + JSON.stringify(outputEl, null, 4));
    }
  }, 1/8 * 1000);
