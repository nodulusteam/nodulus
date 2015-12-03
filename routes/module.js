
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("../classes/dal.js");
var api = require("../classes/api.js");
var moduleUtiliity = require("../classes/module_installer.js");
var moment = require('moment');
 


 


router.post('/install', function (req, res) {
    if (!req.body) return res.sendStatus(400);   
     
    var module_name = req.body.name;

    moduleUtiliity.install(module_name);
     
    
     
    
     
 
});

router.post('/uninstall', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    
    var module_name = req.body.name;
    
    moduleUtiliity.uninstall(module_name);
});


 





module.exports = router;



