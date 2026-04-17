// koppel acties aan menu en hou toestand van s gelijk via socketApi.js

//console.log('state.js geladen')
//cc:AutoMow#1;onclick functie
document.getElementById('customSwitchDriveEnable').onclick = DriveEnable
document.getElementById('customSwitchAutoMow').onclick = AutoMow
document.getElementById('customSwitchMes').onclick = Mes
document.getElementById('customSwitchNMEA').onclick = NMEA//knopGedrukt('KnopNMEA') //NMEA
document.getElementById('keuzeGPS').onclick = emitChoiceNMEA

document.getElementById('keuzeSimulatie').onclick = emitChoiceNMEA
document.getElementById('keuzeFile').onclick = emitChoiceNMEA
document.getElementById('contourOpnemen').onclick = emitChoiceContour
document.getElementById('contourOpenen').onclick = emitChoiceContour
document.getElementById('contourTonen').onclick = emitChoiceContour
document.getElementById('contourOplaan').onclick = emitChoiceContour
document.getElementById('contourWissen').onclick = emitChoiceContour
document.getElementById('keuzeLog').onclick = 
document.getElementById('pause').addEventListener('change', function() {
	config.options.scales.xAxes[0].realtime.pause = this.checked;
	//window.myChart.update({duration: 0});
	document.getElementById('pauseValue').innerHTML = this.checked;
})

//menu instellen
socket.on('state', function(s) {
    //console.log('state' + JSON.stringify(s, null, 4))
    document.getElementById('customSwitchDriveEnable').checked = s.driveEnable
    document.getElementById('customSwitchAutoMow').checked = s.autoMow2
    //document.getElementById('AutoMow').innerHTML = 'Automatisch = ' + s.autoMow2
    document.getElementById('customSwitchMes').checked = s.MaaiMES
    document.getElementById('customSwitchNMEA').checked = s.NMEA.state
    document.getElementById('NMEAsource').innerHTML = s.NMEA.choice
    document.getElementById('contourDD').style.backgroundColor = s.contour.recordColor 
    document.getElementById('contourOpnemen').style.backgroundColor = s.contour.recordColor
});
socket.on('alert', function(text){
    console.log('alert : ' + text )
})
socket.on('s', function(s) {
    updateSpeed2(s.targetHeading);
    updateSpeed(s.gps.state)
    updateSpeed1(s.gps.state*1000/60)
    chart.data.datasets[1].data.push({
        x: Date.now(),
        y: s.targetHeading
    });
    chart.data.datasets[3].data.push({
        x: Date.now(),
        y: s.angleError
    });
    updateAngleError(s.angleError);
    chart.data.datasets[4].data.push({
        x: Date.now(),
        y: s.correction
    });
    chart.data.datasets[5].data.push({
        x: Date.now(),
        y: s.LM
    });
    chart.data.datasets[6].data.push({
        x: Date.now(),
        y: s.RM
    })
})
function Mes(){
    socket.emit('KnopMes')
    console.log('KnopMes Emit')
};
6
function emitChoiceNMEA(){
    let choice = $(this).text() //this refereerd naar dropdown-item
    //console.log('in emitChoice %s, %s', choice, this)
    socket.emit('NMEAsource', choice)
};
function emitChoiceContour(){
    let choice = $(this).text() //this refereerd naar dropdown-item
    socket.emit('ContourChoice', choice)
};
//cc:NMEAstream#;startStream1
function knopGedrukt(knop) {
    socket.emit(knop)
    console.log(knop + 'Emit')
}
function NMEA(){
    socket.emit('KnopNMEA')
    console.log('KnopNMEA Emit')
};
function DriveEnable() {
    socket.emit('DriveEnable')
    console.log('DriveEnable Emit')
}
//cc:AutoMow#2;emit naar server
function AutoMow() {
    socket.emit('AutoMow')
    //p = 1;
    console.log('AutoMow Emit')
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
    //trajectPath.length = 0
    trajectPath.splice(0,trajectPath.length)
    console.log('in WisTraject'+ JSON.stringify(trajectPath, null, 4))
}
function AddPoint() {
    socket.emit('AddPoint')
    console.log('AddPoint Emit')
}