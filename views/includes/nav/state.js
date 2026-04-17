var socket = io();
const containerJsonEditor = document.getElementById("jsoneditor")
const options = {}
//const editor = new JSONEditor(containerJsonEditor, options)
var prevTarget = null
// set json
const initialJson = {
    "Array": [1, 2, 3],
    "Boolean": true,
    "Null": null,
    "Number": 123,
    "Object": {"a": "b", "c": "d"},
    "String": "Hello World"
}
////editor.set(initialJson)

// get json
////const updatedJson = editor.get()

// koppel acties aan menu en hou toestand van s gelijk via socketApi.js

//console.log('state.js geladen')
//cc:AutoMow#1;onclick functie
document.getElementById('reset').onclick = Reset
document.getElementById('customSwitchDriveEnable').onclick = DriveEnable
document.getElementById('customSwitchAutoMow').onclick = AutoMow
document.getElementById('customSwitchMes').onclick = Mes
document.getElementById('customSwitchTest').onclick = SlowTest
document.getElementById('customSwitchNMEA').onclick = NMEA
document.getElementById('customSwitchAutosteer').onclick = Autosteer
document.getElementById('keuzeGPS').onclick = emitChoice
document.getElementById('keuzeGPSudp').onclick = emitChoice
document.getElementById('keuzeGPSSimulatie').onclick = emitChoice
document.getElementById('keuzeGPSudpSimulatie').onclick = emitChoice
document.getElementById('keuzeFile').onclick = emitChoice
document.getElementById('contourOpnemen').onclick = emitChoiceContour
document.getElementById('contourOpenen').onclick = emitChoiceContour
document.getElementById('contourTonen').onclick = emitChoiceContour
document.getElementById('contourOplaan').onclick = emitChoiceContour
document.getElementById('contourWissen').onclick = emitChoiceContour
document.getElementById('customSwitchMission').onclick = emitMission
document.getElementById('customSwitchLog').onclick = emitKnop
document.getElementById('pause').addEventListener('change', function() {
	config.options.scales.xAxes[0].realtime.pause = this.checked;
	//window.myChart.update({duration: 0});
	document.getElementById('pauseValue').innerHTML = this.checked;
})

//menu instellen
socket.on('state', function(GUI) {
    console.log('GUI' + JSON.stringify(GUI, null, 4))
    document.getElementById('customSwitchDriveEnable').checked = GUI.driveEnable
    document.getElementById('customSwitchAutoMow').checked = GUI.autoMow2
    //document.getElementById('AutoMow').innerHTML = 'Automatisch = ' + GUI.autoMow2
    document.getElementById('customSwitchMes').checked = GUI.MaaiMES
    document.getElementById('customSwitchTest').checked = GUI.SlowTest
    document.getElementById('customSwitchNMEA').checked = GUI.NMEA.state
    document.getElementById('customSwitchAutosteer').checked = GUI.Autosteer
    document.getElementById('NMEAsource').innerHTML = GUI.NMEA.choice
    document.getElementById('customSwitchMission').checked = GUI.mission.active
    document.getElementById('contourDD').style.backgroundColor = GUI.contour.recordColor 
    document.getElementById('contourOpnemen').style.backgroundColor = GUI.contour.recordColor
    //popup files laten zien 
    for (const item of GUI.contour.fileList) {       
        let str = '<div class="form-check"><input class="form-check-input" type="radio" id="' + item + '" name="flexRadioDefault"><label class="form-check-label" for="' + item + '">' + item + '</label></div>'
        GUI.contour.fileListStr += str
    }
    document.getElementById('fileList').innerHTML = GUI.contour.fileListStr
})

socket.on('s', function(GUI) {
    console.log(GUI)
    updateSpeed(parseInt(GUI.speedometer.avgSpeed * 10)/10, parseInt(GUI.speedometer.heading * 10)/10)
   // updateSpeed(parseInt(GUI.mf.avgSpeed * 10)/10, parseInt(GUI.speedometer.heading * 10)/10)
    //updateSpeed(GUI.gps.state.speed, GUI.gps.state.bearing)
    //updateSpeed2(GUI.targetHeading);
    updateSpeed2(parseInt(GUI.speedometer.localHeading*10)/10, GUI.mf.guidanceLineDistanceOff, GUI.speedometer.howManyPathsAway)
        //te = t1 - Date.now();
        //t1 = Date.now();

    // append the new data to the existing chart data
    chart.data.datasets[0].data.push({
        x: Date.now(),
        y: GUI.gps.state.speed * 10
    });
    chart.data.datasets[1].data.push({
        x: Date.now(),
        y: GUI.mf.guidanceLineSteerAngle//GUI.targetHeading
    });
    chart.data.datasets[2].data.push({
        x: Date.now(),
        y: GUI.gps.state.bearing
    });
    chart.data.datasets[3].data.push({
        x: Date.now(),
        y: GUI.angleError
    });
    updateAngleError(GUI.angleError);
    chart.data.datasets[4].data.push({
        x: Date.now(),
        y: GUI.correction
    });
    chart.data.datasets[5].data.push({
        x: Date.now(),
        y: GUI.LM
    });
    chart.data.datasets[6].data.push({
        x: Date.now(),
        y: GUI.RM
    })
    chart.update({
        preservation: true
    })
    updateAngleIMU(GUI.angleIMU)
    //editor.set(GUI.contour.recList)
    //var newwidth = $('.chartAreaWrapper2').width(); // te/100;// maak chart scrollable was 50 //http://jsfiddle.net/jmpxgufu/
    //$('.chartAreaWrapper2').width(newwidth);
    /*$('.chartAreaWrapper').animate({
        scrollLeft: newwidth
    });*/
})
socket.on('alert', function(text){
    console.log('alert : ' + text )
})
// socket.on('jsonEditor', function(json) {
//     editor.set(json)
// })

$('#LoadMission').click(function() {
    var value = $("input:radio:checked").next().text();
    $('#mission_input').val(value);
    socket.emit('missionBestand', value)
    $('#ContourOpenen').modal('hide');
});
function Reset() {
    socket.emit('KnopReset')
    console.log('KnopReset Emit')
}
function Mes(){
    socket.emit('KnopMes')
    console.log('KnopMes Emit')
}
function SlowTest() {
    socket.emit('KnopTest')
    console.log('KnopTest Emit')
}
function emitChoice(){
    let choice = $(this).text() //this refereerd naar dropdown-item
    socket.emit('NMEAsource', choice)
};
function emitChoiceContour(){
    console.log(this)
    let choice = $(this).text() //this refereerd naar dropdown-item
    socket.emit('ContourChoice', choice)
};
function emitKnop() {
    //console.log($(this).id())
    //socket.emit('Knop', $(this).id())
    console.log($(this.id))
}
function Log(){
    socket.emit('KnopLog')
    console.log('KnopLog Emit')
};
function NMEA(){
    socket.emit('KnopNMEA')
    console.log('KnopNMEA Emit')
};
function Autosteer(){
    socket.emit('KnopAutosteer')
    console.log('KnopAutosteer Emit')
}
function emitMission() {
    socket.emit('KnopMission')
    console.log('KnopMission Emit')
}
function DriveEnable() {
    socket.emit('DriveEnable')
    console.log('DriveEnable Emit')
}
function AutoMow() {
    // socket.emit('AutoMow')
    // console.log('AutoMow Emit')
    socket.emit('AutoMow1')
    console.log('AutoMow1 Emit')
}
function AutoMow2() {
    socket.emit('AutoMow2')
    console.log('AutoMow2 Emit')
}
function Cirkel1() {
    socket.emit('Cirkel1')
    console.log('Cirkel1 Emit')
}
function FixedRoute1() {
    socket.emit('FixedRoute1')
    console.log('FixedRoute1 Emit')
}
function FixedRoute2() {
    socket.emit('FixedRoute2')
    console.log('FixedRoute2 Emit')
}
function WisTraject() {
    socket.emit('WisTraject')
    console.log('WisTraject Emit')
    trajectPath.splice(0,trajectPath.length)
    console.log('in WisTraject'+ JSON.stringify(trajectPath, null, 4))
}
function AddPoint() {
    socket.emit('AddPoint')
    console.log('AddPoint Emit')
}