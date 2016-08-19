/*                 _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016
 */
"use strict";
/// <reference path="../typings/main.d.ts" />
var config = require("@nodulus/config").config;
var consts = require("@nodulus/config").consts;
var dal = require("@nodulus/data");
var users_1 = require("../app/users");
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
var appRoot = global.appRoot;
router.post("/setup", function (req, res) {
    var setupConfig = req.body;
    //  var configurationPath = path.join(global.serverAppRoot, "config", "config.json");
    var configurationObject = config; //JSON.parse(fs.readFileSync(configurationPath, 'utf8').replace(/^\uFEFF/, ''));
    configurationObject["database"] = setupConfig["database"];
    if (configurationObject["database"].diskdb)
        fs.ensureDirSync(configurationObject["database"].diskdb.host);
    //for (var key in configurationObject) {
    //    if (setupConfig[key]) {
    //        configurationObject[key] = setupConfig[key];
    //    }
    //}
    //  fs.writeFileSync(configurationPath, JSON.stringify(configurationObject), 'utf8');
    config.persistConfiguration();
    var userObj = {
        Email: setupConfig.Email,
        Password: setupConfig.Password
    };
    //register the default user    
    users_1.users.register(userObj, function () {
        var setupConfigPath = path.join(global.clientAppRoot, "nodulus.json");
        fs.writeFileSync(setupConfigPath, JSON.stringify({ active: new Date() }), 'utf8');
        res.status(200).json(setupConfig);
    });
});
module.exports = router;
