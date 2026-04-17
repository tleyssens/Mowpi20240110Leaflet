"use strict";

//console.log(app.locals)
var socket = io(); //const containerJsonEditor = document.getElementById("jsoneditor")

var options = {}; //const editor = new JSONEditor(containerJsonEditor, options)

var prevTarget = null; // set json

var initialJson = {
  Array: [1, 2, 3],
  Boolean: true,
  Null: null,
  Number: 123,
  Object: {
    a: "b",
    c: "d"
  },
  String: "Hello World"
}; //editor.set(initialJson)
// get json
//const updatedJson = editor.get()
// koppel acties aan menu en hou toestand van s gelijk via socketApi.js
//console.log('state.js geladen')
//cc:AutoMow#1;onclick functie
// document.getElementById('customSwitchDriveEnable').onclick = DriveEnable
// document.getElementById('customSwitchAutoMow').onclick = AutoMow
// document.getElementById('customSwitchMes').onclick = Mes
// document.getElementById('customSwitchNMEA').onclick = NMEA
// document.getElementById('keuzeGPS').onclick = emitChoice
// document.getElementById('keuzeSimulatie').onclick = emitChoice
// document.getElementById('keuzeFile').onclick = emitChoice
// document.getElementById('contourOpnemen').onclick = emitChoiceContour
// document.getElementById('contourOpenen').onclick = emitChoiceContour
// document.getElementById('contourTonen').onclick = emitChoiceContour
// document.getElementById('contourOplaan').onclick = emitChoiceContour
// document.getElementById('contourWissen').onclick = emitChoiceContour
// document.getElementById('customSwitchMission').onclick = emitMission
// document.getElementById('customSwitchLog').onclick = emitKnop
// document.getElementById('pause').addEventListener('change', function () {
//     config.options.scales.xAxes[0].realtime.pause = this.checked;
//     //window.myChart.update({duration: 0});
//     document.getElementById('pauseValue').innerHTML = this.checked;
// })
//menu instellen

socket.on("state", function (s) {
  console.log("state" + JSON.stringify(s, null, 4));
  document.getElementById("customSwitchDriveEnable").checked = s.driveEnable;
  document.getElementById("customSwitchAutoMow").checked = s.autoMow2; //document.getElementById('AutoMow').innerHTML = 'Automatisch = ' + s.autoMow2

  document.getElementById("customSwitchMes").checked = s.GUI.MaaiMES;
  document.getElementById("customSwitchNMEA").checked = s.GUI.NMEA.state;
  document.getElementById("NMEAsource").innerHTML = s.GUI.NMEA.choice;
  document.getElementById("customSwitchMission").checked = s.mission.active;
  document.getElementById("contourDD").style.backgroundColor = s.GUI.contour.recordColor;
  document.getElementById("contourOpnemen").style.backgroundColor = s.GUI.contour.recordColor; //popup files laten zien

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = s.contour.fileList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
      var str = '<div class="form-check"><input class="form-check-input" type="radio" id="' + item + '" name="flexRadioDefault"><label class="form-check-label" for="' + item + '">' + item + "</label></div>";
      s.contour.fileListStr += str;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  document.getElementById("fileList").innerHTML = s.contour.fileListStr;
});
socket.on("alert", function (text) {
  console.log("alert : " + text);
});
socket.on('s', function (s) {
  console.log(s);
  updateSpeed2(s.GUI.targetHeading);
  updateSpeed(s.GUI.gps.state);
  updateSpeed1(s.GUI.gps.state);
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
    y: s.GUI.LM
  });
  chart.data.datasets[6].data.push({
    x: Date.now(),
    y: s.GUI.RM
  });
  updateAngleIMU(s.angleIMU); //editor.set(s.contour.recList)
}); // socket.on("jsonEditor", function (json) {
//   editor.set(json);
// });

$("#LoadMission").click(function () {
  var value = $("input:radio:checked").next().text();
  $("#mission_input").val(value);
  socket.emit("missionBestand", value);
  $("#ContourOpenen").modal("hide");
});

function Mes() {
  socket.emit("KnopMes");
  console.log("KnopMes Emit");
}

function emitChoice() {
  var choice = $(this).text(); //this refereerd naar dropdown-item
  //console.log('in emitChoice %s, %s', choice, this)

  socket.emit("NMEAsource", choice);
}

function emitChoiceContour() {
  console.log(this);
  var choice = $(this).text(); //this refereerd naar dropdown-item

  socket.emit("ContourChoice", choice);
} //cc:NMEAstream#;startStream1


function emitKnop() {
  //console.log($(this).id())
  //socket.emit('Knop', $(this).id())
  console.log($(this.id));
}

function Log() {
  socket.emit("KnopLog");
  console.log("KnopLog Emit");
}

function NMEA() {
  socket.emit("KnopNMEA");
  console.log("KnopNMEA Emit");
}

function emitMission() {
  socket.emit("KnopMission");
  console.log("KnopMission Emit");
}

function DriveEnable() {
  socket.emit("DriveEnable");
  console.log("DriveEnable Emit");
} //cc:AutoMow#2;emit naar server


function AutoMow() {
  //socket.emit("AutoMow");
  //p = 1;
  //console.log("AutoMow Emit");
  socket.emit("AutoMow1");
  console.log("AutoMow1 Emit");
}

function AutoMow2() {
  socket.emit("AutoMow2");
  console.log("AutoMow2 Emit");
}

function Cirkel1() {
  socket.emit("Cirkel1");
  console.log("Cirkel1 Emit");
}

function FixedRoute1() {
  socket.emit("FixedRoute1");
  console.log("FixedRoute1 Emit");
}

function FixedRoute2() {
  socket.emit("FixedRoute2");
  console.log("FixedRoute2 Emit");
}

function WisTraject() {
  socket.emit("WisTraject");
  console.log("WisTraject Emit"); //trajectPath.length = 0

  trajectPath.splice(0, trajectPath.length);
  console.log("in WisTraject" + JSON.stringify(trajectPath, null, 4));
}

function AddPoint() {
  socket.emit("AddPoint");
  console.log("AddPoint Emit");
}