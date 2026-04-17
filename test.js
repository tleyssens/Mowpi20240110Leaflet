"use strict";
const { LatLon } = require ('geodesy/utm.js')
        console.log('test')
        const latLongP = new LatLon(52.2, 0.12);
        const utmCoord = latLongP.toUtm();
        console.log(JSON.stringify(utmCoord, null, 4)); // '31 N 303189 5787193'