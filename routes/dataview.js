var express = require('express');
var router = express.Router();

let dataview = require('../controllers/dataview');
var app = require('../app'); //was const

router.get('/', dataview.index);

module.exports = router;