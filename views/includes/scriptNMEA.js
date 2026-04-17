socket.on('nmea', function (data) { //laat de nmea zien in de browser
    NMEA.gpsData = data;
});

NMEA = new Vue({
    el: "#NMEA",
    data: {
        gpsData: "Hier komt de nmea-stream"
    },
    methods: {}
});
quality = new Vue({
    el: "#quality",
    data: {
        qualitydata: "quality"
    },
    methods: {
    }
})
waypoint = new Vue({
    el: "#waypoint",
    data: {
        waypointdata: "waypointClick"
    },
    methods: {}
})
targetDist = new Vue({
    el: "#targetDist",
    data: {
        targetDist: "Hier komt de targetDistance"
    },
})
goalPointDistance = new Vue({
    el: "#goalPointDistance",
    data: {
        goalPointDistancedata: "goalPointDistance"
    },
    methods: {}
})
socket.on('goalPointDistance', function (data) { 
    console.log("socket=>goalPointDistance ontvangen" + data)
    goalPointDistance.goalPointDistancedata = data
})

socket.on('quality', function (data) { 
    console.log("socket=>quality ontvangen " + data)
    quality.qualitydata = data
})
socket.on('s', function(data) {
    console.log("socket=>s ontvangen")
    settings.settingsdata = data //verwijst naar de Vue-component setting onderaan
    NMEA.gpsData = data.gps;
})
settings = new Vue({
    el:"#settings",
    data: {
        settingsdata: "Hier komen settings.json of s"
    }
})
