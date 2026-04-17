var express = require('express');
var router = express.Router();
//cc:1_OpstartenServer#5; serveer  	
let index = require('../controllers/index');
	
/* GET home page. */
router.get('/', index.index);
  
module.exports = router; 