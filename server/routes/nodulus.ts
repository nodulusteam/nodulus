/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
  
/// <reference path="../typings/main.d.ts" />

var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
var config = require('../app/config.js');
var dal = require("../app/dal.js");
var appRoot = global["appRoot"];

router.post("/setup", function (req: any, res: any) {

    var setupConfig = req.body;
    var setupConfigPath = appRoot + "\\public\\config\\setup.json";
  
    fs.writeFileSync(setupConfigPath,JSON.stringify({active: new Date()}), 'utf8');
    
    var configurationPath = appRoot + "\\config\\config.json";
    
     
    var configurationObject = JSON.parse(fs.readFileSync(configurationPath, 'utf8').replace(/^\uFEFF/, ''));
    configurationObject["database"] = setupConfig["database"];

    //for (var key in configurationObject) {
    //    if (setupConfig[key]) {
    //        configurationObject[key] = setupConfig[key];
    //    }

    //}
    fs.writeFileSync(configurationPath, JSON.stringify(configurationObject), 'utf8');
    
    var userObj = {
        Email: setupConfig.Email,
        Password: setupConfig.Password
    
    }
   
    //register the default user
    var userDB = require("../app/users").users;
    userDB.register(userObj, function () { 
        res.status(200).json(setupConfig);
    
    })
    

    

});



module.exports = router;



