pi@mowpi1:~ $ cd MowPi1_MowPi100/MowPi202203
pi@mowpi1:~/MowPi1_MowPi100/MowPi202203 $ sudo DEBUG=tom:* node bin/www
In MotorSetup enable:11; cw:10, ccw:9, minSpeed:10, maxSpeed:255
In MotorSetup enable:26; cw:27, ccw:17, minSpeed:10, maxSpeed:255
  tom:NmeaFunc vec3 [
  vecFix2Fix { easting: 0, distance: 0, northing: 0, isSet: 0 },
  vecFix2Fix { easting: 0, distance: 0, northing: 0, isSet: 0 },
  vecFix2Fix { easting: 0, distance: 0, northing: 0, isSet: 0 },
  vecFix2Fix { easting: 0, distance: 0, northing: 0, isSet: 0 },
  vecFix2Fix { easting: 0, distance: 0, northing: 0, isSet: 0 }
] +0ms
  tom:NmeaFunc vec3 [class vecFix2Fix] +10ms
[
  '_events',         '_eventsCount',
  '_maxListeners',   '_nsps',
  'parentNsps',      '_path',
  'clientPathRegex', '_connectTimeout',
  '_serveClient',    '_parser',
  'encoder',         '_adapter',
  'sockets',         'opts'
]
  tom:socketApi  ***A user connected:  Mes = false, PID = 3174 +0ms
  tom:socketApi  ***A user connected:  Mes = false, PID = 3174 +94ms
GET /map 304 1663.940 ms - -
GET /stylesheets/jsoneditor.min.css 304 22.318 ms - -
GET /stylesheets/style.css 304 21.912 ms - -
GET /stylesheets/bootstrap.min.css 304 23.863 ms - -
GET /javascripts/chart2_8_0.js 304 23.028 ms - -
GET /javascripts/vueSetup.js 304 25.107 ms - -
GET /javascripts/jsoneditor.min.js 304 25.024 ms - -
GET /javascripts/chartjs-plugin-streaming1_8_0 304 25.179 ms - -
GET /stylesheets/bootstrap.bundle.min.js 304 5.582 ms - -
GET /javascripts/moment2_24_0.min.js 304 2.683 ms - -
GET /stylesheets/img/jsoneditor-icons.svg 304 1.832 ms - -
GET /javascripts/jsoneditor.map 404 272.421 ms - 13924
GET /stylesheets/bootstrap.bundle.min.js.map 404 488.218 ms - 13924
GET /stylesheets/bootstrap.min.css.map 404 658.306 ms - 13924
  tom:socketApi  ***A user connected:  Mes = false, PID = 3174 +45s
  tom:socketApi  ***A user connected:  Mes = false, PID = 3174 +18ms
  tom:socketApi Keuze =Openen +3s
  tom:socketApi /home/pi/MowPi1_MowPi100/MowPi202203/public/MissionPlan +0ms
  tom:socketApi Promise { <pending> } +2ms
  tom:socketApi NMEAsource = Simulatie +8s
  tom:socketApi NMEAknop bediend in client +723ms
  tom:NmeaFunc Simulatie start stream +57s
get simulatiestream
  tom:NMEAsimTom latNMEA : 5059.7798196 +0ms
  tom:NMEAsimTom latNMEA = 5059.7798196 longNMEA = 523.29011 degrees 5 stepDistance 0.2 +1ms
  tom:NmeaFunc $GPGGA,143032.610,5059.7798196,N,00523.29011,E,4,16,0.7,48.887,M,45.800,M,,0000*62 +1s
  tom:TomGPS Lat 50.996330326666666, Lon 5.3881685, latStart undefined, lonStart undefined +0ms
  tom:TomGPS mPerDegreeLat 0, mPerDegreeLon 70203.18779245572, Lat 50.996330326666666, LatStart undefined +0ms
  tom:TomGPS Northing NaN +1ms
  tom:TomGPS Easting = NaN +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 1,
    bearing: 0,
    speed: 0.2,
    time: 2022-08-11T14:30:32.610Z,
    lat: 50.996330326666666,
    lon: 5.3881685,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.3881685,
  latitude: 50.996330326666666,
  fix: { northing: NaN, easting: NaN },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99622833522991, 5.388157723792314 ]
  }
}
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 1,
  tom:NmeaFunc   bearing: 0,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:32.610Z,
  tom:NmeaFunc   lat: 50.996330326666666,
  tom:NmeaFunc   lon: 5.3881685,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +26ms
  tom:NmeaFunc InitGPS +4ms
  tom:TomGPS SetLocalMetersPerDegrees +17ms
  tom:TomGPS mPerDegreeLat, lon : 111248.16808876979,70203.18779245572 +0ms
  tom:TomGPS Lat 50.996330326666666, Lon 5.3881685, latStart 50.996330326666666, lonStart 5.3881685 +1ms
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.18779245572, Lat 50.996330326666666, LatStart 50.996330326666666 +0ms 
  tom:TomGPS Northing 0 +1ms
  tom:TomGPS Easting = 0 +0ms
  tom:NmeaFunc gps.fix = { northing: 0, easting: 0 }  +3ms
  tom:NmeaFunc FirstFixPositionSet OK +2ms
  tom:socketApi KnopMission gedrukt +1s
  tom:NMEAsimTom latNMEA : 5059.7798196 +1s
  tom:NMEAsimTom latNMEA = 5059.7798196 longNMEA = 523.29011 degrees 5 stepDistance 0 +0ms
  tom:NmeaFunc $GPGGA,143033.667,5059.7798196,N,00523.29011,E,4,16,0.7,48.887,M,45.800,M,,0000*63 +1s
  tom:TomGPS Lat 50.996330326666666, Lon 5.3881685, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.18779245572, Lat 50.996330326666666, LatStart 50.996330326666666 +1ms 
  tom:TomGPS Northing 0 +1ms
  tom:TomGPS Easting = 0 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 2,
    bearing: 0,
    speed: 0.2,
    time: 2022-08-11T14:30:33.667Z,
    lat: 50.996330326666666,
    lon: 5.3881685,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.3881685,
  latitude: 50.996330326666666,
  fix: { northing: 0, easting: 0 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99631575645725, 5.388166960541319 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:33.667Z, lat: 50.996330326666666, lon: 5.3881685, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143033.667,5059.7798196,N,00523.29011,E,4,16,0.7,48.887,M,45.800,M,,0000*63', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99631575645725, 5.388166960541319 ] } } +11ms
case 200
[
  [ 50.99633833671833, 5.388111424727131 ],
  [ 50.996320611643576, 5.388112765831639 ],
  [ 50.996329052156206, 5.388248217386891 ],
  [ 50.9963509974819, 5.3882629695364725 ]
]
[ 5, 7, 21, 23 ]
start : [ 50.99633833671833, 5.388111424727131 ] |  heading : 177.27368845824662
end : [ 50.996340024820356, 5.388130200190235 ] |  heading : 323.7392102466202
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 2,
  tom:NmeaFunc   bearing: 0,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:33.667Z,
  tom:NmeaFunc   lat: 50.996330326666666,
  tom:NmeaFunc   lon: 5.3881685,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +131ms
  tom:NmeaFunc InitGPS +2ms
arg was => Wachttijd RTK Om
  tom:NMEAsimTom latNMEA : 5059.7798196 +1s
  tom:NMEAsimTom latNMEA = 5059.7798196 longNMEA = 523.29011 degrees 5 stepDistance 0 +1ms
  tom:NmeaFunc $GPGGA,143034.819,5059.7798196,N,00523.29011,E,4,16,0.7,48.887,M,45.800,M,,0000*63 +1s
  tom:TomGPS Lat 50.996330326666666, Lon 5.3881685, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.18779245572, Lat 50.996330326666666, LatStart 50.996330326666666 +1ms 
  tom:TomGPS Northing 0 +0ms
  tom:TomGPS Easting = 0 +1ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 3,
    bearing: 0,
    speed: 0.2,
    time: 2022-08-11T14:30:34.819Z,
    lat: 50.996330326666666,
    lon: 5.3881685,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.3881685,
  latitude: 50.996330326666666,
  fix: { northing: 0, easting: 0 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99632820184445, 5.388168275495608 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:34.819Z, lat: 50.996330326666666, lon: 5.3881685, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143034.819,5059.7798196,N,00523.29011,E,4,16,0.7,48.887,M,45.800,M,,0000*63', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99632820184445, 5.388168275495608 ] } } +10ms
case 203
Promise {
  [Module: null prototype] {
    DIRDATA: [ [Array], [Array], [Array], [Array], [Array], [Array] ],
    DubinsPathType: {
      '0': 'LSL',
      '1': 'LSR',
      '2': 'RSL',
      '3': 'RSR',
      '4': 'RLR',
      '5': 'LRL',
      LSL: 0,
      LSR: 1,
      RSL: 2,
      RSR: 3,
      RLR: 4,
      LRL: 5
    },
    ERROR_CODE: {
      '0': 'EDUBOK',
      '1': 'EDUBCOCONFIGS',
      '2': 'EDUBPARAM',
      '3': 'EDUBBADRHO',
      '4': 'EDUBNOPATH',
      EDUBOK: 0,
      EDUBCOCONFIGS: 1,
      EDUBPARAM: 2,
      EDUBBADRHO: 3,
      EDUBNOPATH: 4
    },
    SegmentType: {
      '0': 'L_SEG',
      '1': 'S_SEG',
      '2': 'R_SEG',
      L_SEG: 0,
      S_SEG: 1,
      R_SEG: 2
    },
    default: [class Dubins]
  }
}
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 3,
  tom:NmeaFunc   bearing: 0,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:34.819Z,
  tom:NmeaFunc   lat: 50.996330326666666,
  tom:NmeaFunc   lon: 5.3881685,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +13ms
  tom:NmeaFunc InitGPS +2ms
  tom:NMEAsimTom latNMEA : 5059.7798196 +1s
  tom:NMEAsimTom latNMEA = 5059.7798196 longNMEA = 523.29011 degrees 5 stepDistance 0 +1ms
  tom:NmeaFunc $GPGGA,143035.854,5059.7798196,N,00523.29011,E,4,16,0.7,48.887,M,45.800,M,,0000*6B +1s
  tom:TomGPS Lat 50.996330326666666, Lon 5.3881685, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.18779245572, Lat 50.996330326666666, LatStart 50.996330326666666 +1ms 
  tom:TomGPS Northing 0 +1ms
  tom:TomGPS Easting = 0 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 4,
    bearing: 0,
    speed: 0.2,
    time: 2022-08-11T14:30:35.854Z,
    lat: 50.996330326666666,
    lon: 5.3881685,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.3881685,
  latitude: 50.996330326666666,
  fix: { northing: 0, easting: 0 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.996330016662206, 5.38816846724556 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:35.854Z, lat: 50.996330326666666, lon: 5.3881685, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143035.854,5059.7798196,N,00523.29011,E,4,16,0.7,48.887,M,45.800,M,,0000*6B', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.996330016662206, 5.38816846724556 ] } } +11ms
in case 205
"log||traject met huidige positie + startpunt MowArea + contour = 50.996330016662206,5.38816846724556,huidige positie,50.99633833671833,5.388111424727131,50.99632061164357,5.388112765831651,50.996329052156206,5.388248217386891,50.9963509974819,5.3882629695364725,50.99633892659632,5.388118485301542,50.996334437377,5.388118828960728,50.99632554252945,5.388119509879857,50.99633274259242,5.388243931395155,50.996346275517986,5.388253107238394,50.99633505924205,5.388125882638501,50.996330570366396,5.388126237391067,50.99633044183519,5.3881262475488,50.99633645130417,5.388239688210546,50.9963415345261,5.388243204317218,50.996331230737916,5.388133282274009,50.996330817810424,5.38813334476605,50.996331230737916,5.388133282274008,50.99634014409212,5.388235616546751,50.99633680540449,5.388233133875834,50.996331243242984,5.388140434967983,50.996340024820356,5.388130200190235||trajectDistance = 4.098950763409846||target = {\n    \"lat\": 50.99633164050553,\n    \"lon\": 5.3881573341506055,\n    \"n\": 1\n}"
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 4,
  tom:NmeaFunc   bearing: 0,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:35.854Z,
  tom:NmeaFunc   lat: 50.996330326666666,
  tom:NmeaFunc   lon: 5.3881685,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +11ms
  tom:NmeaFunc InitGPS +2ms
  tom:NMEAsimTom latNMEA : 5059.7798734 +1s
  tom:NMEAsimTom latNMEA = 5059.7798734 longNMEA = 523.2901175 degrees 5 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143036.889,5059.7798734,N,00523.2901175,E,4,16,0.7,48.887,M,45.800,M,,0000*64 +1s
  tom:TomGPS Lat 50.996331223333335, Lon 5.388168625, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.18643950691, Lat 50.996331223333335, LatStart 50.996330326666666 +1ms 
  tom:TomGPS Northing 0.09975252440183333 +1ms
  tom:TomGPS Easting = 0.008775398282782614 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 5,
    bearing: 0,
    speed: 0.2,
    time: 2022-08-11T14:30:36.889Z,
    lat: 50.996331223333335,
    lon: 5.388168625,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388168625,
  latitude: 50.996331223333335,
  fix: { northing: 0.09975252440183333, easting: 0.008775398282782614 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.996331047282425, 5.388168601983942 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:36.889Z, lat: 50.996331223333335, lon: 5.388168625, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143036.889,5059.7798734,N,00523.2901175,E,4,16,0.7,48.887,M,45.800,M,,0000*64', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.996331047282425, 5.388168601983942 ] } } +8ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 5,
  tom:NmeaFunc   bearing: 0,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:36.889Z,
  tom:NmeaFunc   lat: 50.996331223333335,
  tom:NmeaFunc   lon: 5.388168625,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +5ms
  tom:NmeaFunc InitGPS +2ms
  tom:NMEAsimTom latNMEA : 5059.7799252 +1s
  tom:NMEAsimTom latNMEA = 5059.7799252 longNMEA = 523.2900939 degrees 344 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143037.915,5059.7799252,N,00523.2900939,E,4,16,0.7,48.887,M,45.800,M,,0000*64 +1s
  tom:TomGPS Lat 50.99633208666667, Lon 5.388168231666667, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1851368536, Lat 50.99633208666667, LatStart 50.996330326666666 +1ms   
  tom:TomGPS Northing 0.19579677622721717 +1ms
  tom:TomGPS Easting = -0.018837854678216283 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 6,
    bearing: 0,
    speed: 0.2,
    time: 2022-08-11T14:30:37.915Z,
    lat: 50.99633208666667,
    lon: 5.388168231666667,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388168231666667,
  latitude: 50.99633208666667,
  fix: { northing: 0.19579677622721717, easting: -0.018837854678216283 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633193502255, 5.388168285695229 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:37.915Z, lat: 50.99633208666667, lon: 5.388168231666667, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143037.915,5059.7799252,N,00523.2900939,E,4,16,0.7,48.887,M,45.800,M,,0000*64', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633193502255, 5.388168285695229 ] } } +7ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 6,
  tom:NmeaFunc   bearing: -12.638673705869508,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:37.915Z,
  tom:NmeaFunc   lat: 50.99633208666667,
  tom:NmeaFunc   lon: 5.388168231666667,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +4ms
  tom:NmeaFunc InitGPS +2ms
  tom:NMEAsimTom latNMEA : 5059.7799763 +1s
  tom:NMEAsimTom latNMEA = 5059.7799763 longNMEA = 523.290066 degrees 341 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143038.940,5059.7799763,N,00523.290066,E,4,16,0.7,48.887,M,45.800,M,,0000*5F +1s
  tom:TomGPS Lat 50.99633293833333, Lon 5.388167766666666, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1838518037, Lat 50.99633293833333, LatStart 50.996330326666666 +1ms   
  tom:TomGPS Northing 0.2905431322556108 +1ms
  tom:TomGPS Easting = -0.05148233484432273 +1ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 7,
    bearing: -12.638673705869508,
    speed: 0.2,
    time: 2022-08-11T14:30:38.940Z,
    lat: 50.99633293833333,
    lon: 5.388167766666666,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388167766666666,
  latitude: 50.99633293833333,
  fix: { northing: 0.2905431322556108, easting: -0.05148233484432273 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633279195226, 5.388167842391913 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:38.940Z, lat: 50.99633293833333, lon: 5.388167766666666, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143038.940,5059.7799763,N,00523.290066,E,4,16,0.7,48.887,M,45.800,M,,0000*5F', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633279195226, 5.388167842391913 ] 
} } +18ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 7,
  tom:NmeaFunc   bearing: -18.03437594439447,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:38.940Z,
  tom:NmeaFunc   lat: 50.99633293833333,
  tom:NmeaFunc   lon: 5.388167766666666,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +5ms
  tom:NmeaFunc InitGPS +6ms
  tom:NMEAsimTom latNMEA : 5059.7800263 +1s
  tom:NMEAsimTom latNMEA = 5059.7800263 longNMEA = 523.2900339 degrees 338 stepDistance 0.1 +0ms
  tom:NmeaFunc $GPGGA,143039.987,5059.7800263,N,00523.2900339,E,4,16,0.7,48.887,M,45.800,M,,0000*66 +1s
  tom:TomGPS Lat 50.99633377166667, Lon 5.3881672316666664, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1825944163, Lat 50.99633377166667, LatStart 50.996330326666666 +0ms   
  tom:TomGPS Northing 0.38324993955265585 +1ms
  tom:TomGPS Easting = -0.08904103660022476 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 8,
    bearing: -18.03437594439447,
    speed: 0.2,
    time: 2022-08-11T14:30:39.987Z,
    lat: 50.99633377166667,
    lon: 5.3881672316666664,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.3881672316666664,
  latitude: 50.99633377166667,
  fix: { northing: 0.38324993955265585, easting: -0.08904103660022476 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.996333628728266, 5.388167320770279 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:39.987Z, lat: 50.99633377166667, lon: 5.3881672316666664, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143039.987,5059.7800263,N,00523.2900339,E,4,16,0.7,48.887,M,45.800,M,,0000*66', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.996333628728266, 5.388167320770279 ] } } +7ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 8,
  tom:NmeaFunc   bearing: -21.421610756975213,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:39.987Z,
  tom:NmeaFunc   lat: 50.99633377166667,
  tom:NmeaFunc   lon: 5.3881672316666664,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +3ms
  tom:NmeaFunc InitGPS +1ms
  tom:NMEAsimTom latNMEA : 5059.7800748 +1s
  tom:NMEAsimTom latNMEA = 5059.7800748 longNMEA = 523.2899963 degrees 334 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143041.007,5059.7800748,N,00523.2899963,E,4,16,0.7,48.887,M,45.800,M,,0000*60 +1s
  tom:TomGPS Lat 50.99633458, Lon 5.388166605, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.18137475052, Lat 50.99633458, LatStart 50.996330326666666 +0ms        
  tom:TomGPS Northing 0.47317554202213097 +0ms
  tom:TomGPS Easting = -0.1330350286760476 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 9,
    bearing: -21.421610756975213,
    speed: 0.2,
    time: 2022-08-11T14:30:41.007Z,
    lat: 50.99633458,
    lon: 5.388166605,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388166605,
  latitude: 50.99633458,
  fix: { northing: 0.47317554202213097, easting: -0.1330350286760476 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.996334441211324, 5.388166709429477 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:41.007Z, lat: 50.99633458, lon: 5.388166605, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143041.007,5059.7800748,N,00523.2899963,E,4,16,0.7,48.887,M,45.800,M,,0000*60', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.996334441211324, 5.388166709429477 ] } } +3ms  
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 9,
  tom:NmeaFunc   bearing: -23.381111196886422,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:41.007Z,
  tom:NmeaFunc   lat: 50.99633458,
  tom:NmeaFunc   lon: 5.388166605,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +2ms
  tom:NmeaFunc InitGPS +1ms
  tom:NMEAsimTom latNMEA : 5059.7801205 +1s
  tom:NMEAsimTom latNMEA = 5059.7801205 longNMEA = 523.2899508 degrees 328 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143042.021,5059.7801205,N,00523.2899508,E,4,16,0.7,48.887,M,45.800,M,,0000*6B +1s
  tom:TomGPS Lat 50.996335341666665, Lon 5.388165846666666, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1802254984, Lat 50.996335341666665, LatStart 50.996330326666666 +0ms  
  tom:TomGPS Northing 0.5579095628845767 +0ms
  tom:TomGPS Easting = -0.18627243820939451 +1ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 10,
    bearing: -23.381111196886422,
    speed: 0.2,
    time: 2022-08-11T14:30:42.021Z,
    lat: 50.996335341666665,
    lon: 5.388165846666666,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388165846666666,
  latitude: 50.996335341666665,
  fix: { northing: 0.5579095628845767, easting: -0.18627243820939451 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.996335210292, 5.388165972542064 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:42.021Z, lat: 50.996335341666665, lon: 5.388165846666666, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143042.021,5059.7801205,N,00523.2899508,E,4,16,0.7,48.887,M,45.800,M,,0000*6B', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.996335210292, 5.388165972542064 ] 
} } +5ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 10,
  tom:NmeaFunc   bearing: -31.091028742218555,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:42.021Z,
  tom:NmeaFunc   lat: 50.996335341666665,
  tom:NmeaFunc   lon: 5.388165846666666,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +3ms
  tom:NmeaFunc InitGPS +2ms
  tom:NMEAsimTom latNMEA : 5059.7801642 +1s
  tom:NMEAsimTom latNMEA = 5059.7801642 longNMEA = 523.2899004 degrees 324 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143043.042,5059.7801642,N,00523.2899004,E,4,16,0.7,48.887,M,45.800,M,,0000*61 +1s
  tom:TomGPS Lat 50.99633607, Lon 5.388165006666667, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1791265418, Lat 50.99633607, LatStart 50.996330326666666 +0ms
  tom:TomGPS Northing 0.6389353119610388 +0ms
  tom:TomGPS Easting = -0.24524310571316363 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 11,
    bearing: -31.091028742218555,
    speed: 0.2,
    time: 2022-08-11T14:30:43.042Z,
    lat: 50.99633607,
    lon: 5.388165006666667,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388165006666667,
  latitude: 50.99633607,
  fix: { northing: 0.6389353119610388, easting: -0.24524310571316363 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633594457029, 5.388165147585989 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:43.042Z, lat: 50.99633607, lon: 5.388165006666667, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143043.042,5059.7801642,N,00523.2899004,E,4,16,0.7,48.887,M,45.800,M,,0000*61', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633594457029, 5.388165147585989 ] } } +4ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 11,
  tom:NmeaFunc   bearing: -33.17883446360304,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:43.042Z,
  tom:NmeaFunc   lat: 50.99633607,
  tom:NmeaFunc   lon: 5.388165006666667,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +4ms
  tom:NmeaFunc InitGPS +1ms
  tom:NMEAsimTom latNMEA : 5059.7802037 +1s
  tom:NMEAsimTom latNMEA = 5059.7802037 longNMEA = 523.289842 degrees 317 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143044.057,5059.7802037,N,00523.289842,E,4,16,0.7,48.887,M,45.800,M,,0000*56 +1s
  tom:TomGPS Lat 50.99633672833333, Lon 5.388164033333333, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1781332057, Lat 50.99633672833333, LatStart 50.996330326666666 +1ms   
  tom:TomGPS Northing 0.7121736894174228 +0ms
  tom:TomGPS Easting = -0.3135741956680711 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 12,
    bearing: -33.17883446360304,
    speed: 0.2,
    time: 2022-08-11T14:30:44.057Z,
    lat: 50.99633672833333,
    lon: 5.388164033333333,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388164033333333,
  latitude: 50.99633672833333,
  fix: { northing: 0.7121736894174228, easting: -0.3135741956680711 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633661398384, 5.388164195900605 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:44.057Z, lat: 50.99633672833333, lon: 5.388164033333333, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143044.057,5059.7802037,N,00523.289842,E,4,16,0.7,48.887,M,45.800,M,,0000*56', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633661398384, 5.388164195900605 ] 
} } +7ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 12,
  tom:NmeaFunc   bearing: -41.820803794447215,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:44.057Z,
  tom:NmeaFunc   lat: 50.99633672833333,
  tom:NmeaFunc   lon: 5.388164033333333,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +2ms
  tom:NmeaFunc InitGPS +3ms
GET /futurePoint.png 304 3.189 ms - -
GET /trajectPoint.png 304 1.945 ms - -
  tom:NMEAsimTom latNMEA : 5059.7802391 +1s
  tom:NMEAsimTom latNMEA = 5059.7802391 longNMEA = 523.2897773 degrees 311 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143045.076,5059.7802391,N,00523.2897773,E,4,16,0.7,48.887,M,45.800,M,,0000*61 +1s
  tom:TomGPS Lat 50.99633731833333, Lon 5.388162955, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.17724297539, Lat 50.99633731833333, LatStart 50.996330326666666 +1ms  
  tom:TomGPS Northing 0.7778101084873182 +1ms
  tom:TomGPS Easting = -0.3892766177847167 +1ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 13,
    bearing: -41.820803794447215,
    speed: 0.2,
    time: 2022-08-11T14:30:45.076Z,
    lat: 50.99633731833333,
    lon: 5.388162955,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388162955,
  latitude: 50.99633731833333,
  fix: { northing: 0.7778101084873182, easting: -0.3892766177847167 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633721557013, 5.388163136044959 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:45.076Z, lat: 50.99633731833333, lon: 5.388162955, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143045.076,5059.7802391,N,00523.2897773,E,4,16,0.7,48.887,M,45.800,M,,0000*61', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633721557013, 5.388163136044959 ] } } +18ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 13,
  tom:NmeaFunc   bearing: -44.8871671040464,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:45.076Z,
  tom:NmeaFunc   lat: 50.99633731833333,
  tom:NmeaFunc   lon: 5.388162955,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +3ms
  tom:NmeaFunc InitGPS +6ms
  tom:NMEAsimTom latNMEA : 5059.7802677 +1s
  tom:NMEAsimTom latNMEA = 5059.7802677 longNMEA = 523.2897046 degrees 302 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143046.113,5059.7802677,N,00523.2897046,E,4,16,0.7,48.887,M,45.800,M,,0000*6C +1s
  tom:TomGPS Lat 50.996337795, Lon 5.388161743333334, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.17652374975, Lat 50.996337795, LatStart 50.996330326666666 +0ms       
  tom:TomGPS Northing 0.8308384023782169 +0ms
  tom:TomGPS Easting = -0.47433946267680266 +1ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 14,
    bearing: -44.8871671040464,
    speed: 0.2,
    time: 2022-08-11T14:30:46.113Z,
    lat: 50.996337795,
    lon: 5.388161743333334,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388161743333334,
  latitude: 50.996337795,
  fix: { northing: 0.8308384023782169, easting: -0.47433946267680266 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633771046232, 5.388161946527221 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:46.113Z, lat: 50.996337795, lon: 5.388161743333334, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143046.113,5059.7802677,N,00523.2897046,E,4,16,0.7,48.887,M,45.800,M,,0000*6C', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633771046232, 5.388161946527221 ] } } 
+5ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 14,
  tom:NmeaFunc   bearing: -56.5333457975816,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:46.113Z,
  tom:NmeaFunc   lat: 50.996337795,
  tom:NmeaFunc   lon: 5.388161743333334,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +3ms
  tom:NmeaFunc InitGPS +1ms
  tom:NMEAsimTom latNMEA : 5059.7802913 +1s
  tom:NMEAsimTom latNMEA = 5059.7802913 longNMEA = 523.2896275 degrees 296 stepDistance 0.1 +0ms
  tom:NmeaFunc $GPGGA,143047.131,5059.7802913,N,00523.2896275,E,4,16,0.7,48.887,M,45.800,M,,0000*63 +1s
  tom:TomGPS Lat 50.99633818833333, Lon 5.388160458333333, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.17593026285, Lat 50.99633818833333, LatStart 50.996330326666666 +0ms  
  tom:TomGPS Northing 0.874596014827992 +0ms
  tom:TomGPS Easting = -0.5645505397812951 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 15,
    bearing: -56.5333457975816,
    speed: 0.2,
    time: 2022-08-11T14:30:47.131Z,
    lat: 50.99633818833333,
    lon: 5.388160458333333,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388160458333333,
  latitude: 50.99633818833333,
  fix: { northing: 0.874596014827992, easting: -0.5645505397812951 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633811861289, 5.388160675457895 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:47.131Z, lat: 50.99633818833333, lon: 5.388160458333333, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143047.131,5059.7802913,N,00523.2896275,E,4,16,0.7,48.887,M,45.800,M,,0000*63', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633811861289, 5.388160675457895 ] } } +3ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 15,
  tom:NmeaFunc   bearing: -59.75236350701488,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:47.131Z,
  tom:NmeaFunc   lat: 50.99633818833333,
  tom:NmeaFunc   lon: 5.388160458333333,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +2ms
  tom:NmeaFunc InitGPS +1ms
  tom:NMEAsimTom latNMEA : 5059.7803071 +1s
  tom:NMEAsimTom latNMEA = 5059.7803071 longNMEA = 523.2895455 degrees 287 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143048.141,5059.7803071,N,00523.2895455,E,4,16,0.7,48.887,M,45.800,M,,0000*60 +1s
  tom:TomGPS Lat 50.99633845166667, Lon 5.388159091666667, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1755329284, Lat 50.99633845166667, LatStart 50.996330326666666 +1ms   
  tom:TomGPS Northing 0.9038913658105455 +0ms
  tom:TomGPS Easting = -0.6604948764383594 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 16,
    bearing: -59.75236350701488,
    speed: 0.2,
    time: 2022-08-11T14:30:48.141Z,
    lat: 50.99633845166667,
    lon: 5.388159091666667,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388159091666667,
  latitude: 50.99633845166667,
  fix: { northing: 0.9038913658105455, easting: -0.6604948764383594 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633840307477, 5.3881593227386935 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:48.141Z, lat: 50.99633845166667, lon: 5.388159091666667, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143048.141,5059.7803071,N,00523.2895455,E,4,16,0.7,48.887,M,45.800,M,,0000*60', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633840307477, 5.3881593227386935 
] } } +2ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 16,
  tom:NmeaFunc   bearing: -71.5241823655864,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:48.141Z,
  tom:NmeaFunc   lat: 50.99633845166667,
  tom:NmeaFunc   lon: 5.388159091666667,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +2ms
  tom:NmeaFunc InitGPS +1ms
  tom:NMEAsimTom latNMEA : 5059.7803183 +1s
  tom:NMEAsimTom latNMEA = 5059.7803183 longNMEA = 523.2894617 degrees 282 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143049.150,5059.7803183,N,00523.2894617,E,4,16,0.7,48.887,M,45.800,M,,0000*68 +1s
  tom:TomGPS Lat 50.996338638333334, Lon 5.388157695, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.1752512736, Lat 50.996338638333334, LatStart 50.996330326666666 +0ms  
  tom:TomGPS Northing 0.9246576906577311 +1ms
  tom:TomGPS Easting = -0.7585453085629156 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 17,
    bearing: -71.5241823655864,
    speed: 0.2,
    time: 2022-08-11T14:30:49.150Z,
    lat: 50.996338638333334,
    lon: 5.388157695,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388157695,
  latitude: 50.996338638333334,
  fix: { northing: 0.9246576906577311, easting: -0.7585453085629156 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633860400957, 5.3881579324838755 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:49.150Z, lat: 50.996338638333334, lon: 5.388157695, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143049.150,5059.7803183,N,00523.2894617,E,4,16,0.7,48.887,M,45.800,M,,0000*68', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633860400957, 5.3881579324838755 ] } } +6ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 17,
  tom:NmeaFunc   bearing: -74.29560705542377,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:49.150Z,
  tom:NmeaFunc   lat: 50.996338638333334,
  tom:NmeaFunc   lon: 5.388157695,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +3ms
  tom:NmeaFunc InitGPS +1ms
^C  tom:NMEAsimTom latNMEA : 5059.7803202 +1s
  tom:NMEAsimTom latNMEA = 5059.7803202 longNMEA = 523.289376 degrees 272 stepDistance 0.1 +0ms
  tom:NmeaFunc $GPGGA,143050.169,5059.7803202,N,00523.289376,E,4,16,0.7,48.887,M,45.800,M,,0000*56 +1s
  tom:TomGPS Lat 50.99633867, Lon 5.388156266666667, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.17520349286, Lat 50.99633867, LatStart 50.996330326666666 +1ms        
  tom:TomGPS Northing 0.9281805492101252 +0ms
  tom:TomGPS Easting = -0.8588188432993615 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 18,
    bearing: -74.29560705542377,
    speed: 0.2,
    time: 2022-08-11T14:30:50.169Z,
    lat: 50.99633867,
    lon: 5.388156266666667,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.388156266666667,
  latitude: 50.99633867,
  fix: { northing: 0.9281805492101252, easting: -0.8588188432993615 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.996338660372125, 5.388156509706122 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:50.169Z, lat: 50.99633867, lon: 5.388156266666667, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143050.169,5059.7803202,N,00523.289376,E,4,16,0.7,48.887,M,45.800,M,,0000*56', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.996338660372125, 5.388156509706122 ] } } +5ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 18,
  tom:NmeaFunc   bearing: -86.3983814347119,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:50.169Z,
  tom:NmeaFunc   lat: 50.99633867,
  tom:NmeaFunc   lon: 5.388156266666667,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +3ms
  tom:NmeaFunc InitGPS +1ms
  tom:NMEAsimTom latNMEA : 5059.7803174 +1s
  tom:NMEAsimTom latNMEA = 5059.7803174 longNMEA = 523.2892903 degrees 267 stepDistance 0.1 +1ms
  tom:NmeaFunc $GPGGA,143051.185,5059.7803174,N,00523.2892903,E,4,16,0.7,48.887,M,45.800,M,,0000*6D +1s
  tom:TomGPS Lat 50.99633862333334, Lon 5.3881548383333335, latStart 50.996330326666666, lonStart 5.3881685 +1s
  tom:TomGPS mPerDegreeLat 111248.16808876979, mPerDegreeLon 70203.17527390657, Lat 50.99633862333334, LatStart 50.996330326666666 +1ms  
  tom:TomGPS Northing 0.9229889683935617 +0ms
  tom:TomGPS Easting = -0.9590923795140469 +0ms
GPS {
  events: { data: [Function (anonymous)], GGA: [Function (anonymous)] },
  state: {
    errors: 0,
    processed: 19,
    bearing: -86.3983814347119,
    speed: 0.2,
    time: 2022-08-11T14:30:51.185Z,
    lat: 50.99633862333334,
    lon: 5.3881548383333335,
    alt: 48.887
  },
  prevSpeedFix: vec2 { easting: 0, northing: 0 },
  avgSpeed: 0,
  longitude: 5.3881548383333335,
  latitude: 50.99633862333334,
  fix: { northing: 0.9229889683935617, easting: -0.9590923795140469 },
  position: {
    cov: [ [Array], [Array] ],
    pos: [ 50.99633862873722, 5.388155082183337 ]
  },
  latStart: 50.996330326666666,
  lonStart: 5.3881685
}
  tom:NmeaFunc Mission active { time: 2022-08-11T14:30:51.185Z, lat: 50.99633862333334, lon: 5.3881548383333335, alt: 48.887, quality: 'rtk', satellites: 16, hdop: 0.7, geoidal: 45.8, age: null, stationID: 0, raw: '$GPGGA,143051.185,5059.7803174,N,00523.2892903,E,4,16,0.7,48.887,M,45.800,M,,0000*6D', valid: true, type: 'GGA', position: { cov: [ [Array], [Array] ], pos: [ 50.99633862873722, 5.388155082183337 
] } } +5ms
  tom:NmeaFunc {
  tom:NmeaFunc   errors: 0,
  tom:NmeaFunc   processed: 19,
  tom:NmeaFunc   bearing: -89.21026408316959,
  tom:NmeaFunc   speed: 0.2,
  tom:NmeaFunc   time: 2022-08-11T14:30:51.185Z,
  tom:NmeaFunc   lat: 50.99633862333334,
  tom:NmeaFunc   lon: 5.3881548383333335,
  tom:NmeaFunc   alt: 48.887
  tom:NmeaFunc } +3ms
  tom:NmeaFunc InitGPS +1ms
bye