/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
  
/// <reference path="../typings/node/node.d.ts" /> 

var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
var config = require('../classes/config.js');
 
var appRoot = global["appRoot"];

router.post("/setup", function (req, res) {

    var setupConfig = req.body;
    var setupConfigPath = appRoot + "\\public\\config\\setup.json";
  
    fs.writeFileSync(setupConfigPath,JSON.stringify(setupConfig), 'utf8');

    res.status(200).json(setupConfig);

});



module.exports = router;



