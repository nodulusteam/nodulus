/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
  
/// <reference path="../typings/main.d.ts" />

import {consts} from "../app/consts";
import {dal} from "../app/dal";
import {config} from "../app/config";
import {users as userDB} from "../app/users";


var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
 

var appRoot = global.appRoot;

router.post("/setup", function (req: any, res: any) {

    var setupConfig = req.body;

    
    var configurationPath = global.serverAppRoot + "config\\config.json";
    
     
    var configurationObject = JSON.parse(fs.readFileSync(configurationPath, 'utf8').replace(/^\uFEFF/, ''));
    configurationObject["database"] = setupConfig["database"];

    if (configurationObject["database"].diskdb)
        fs.ensureDirSync(configurationObject["database"].diskdb.host);
    //for (var key in configurationObject) {
    //    if (setupConfig[key]) {
    //        configurationObject[key] = setupConfig[key];
    //    }

    //}
    fs.writeFileSync(configurationPath, JSON.stringify(configurationObject), 'utf8');

    global.config = new config();

    var userObj = {
        Email: setupConfig.Email,
        Password: setupConfig.Password
    
    }
   
    //register the default user    
    userDB.register(userObj, function () { 
        var setupConfigPath = global.clientAppRoot + "config\\setup.json";
        fs.writeFileSync(setupConfigPath, JSON.stringify({ active: new Date() }), 'utf8');
        res.status(200).json(setupConfig);    
    })
    

    

});



module.exports = router;



