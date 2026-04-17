var express = require('express');
var router = express.Router();

let map = require('../controllers/map');
var app = require('../app'); //was const

router.get('/', map.index);

module.exports = router;