"use strict";

var MyMap = {};
MyMap.map = L.map('leafletMap', {
  center: [39.29564, -76.60689],
  zoom: 20,
  minZoom: 4,
  maxZoom: 25
}); //var element = document.getElementById('leafletMap');
//var leafletMap = L.map(element)

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  maxNativeZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(MyMap.map); //leafletMap.setView([51.505, -0.09], 13);