"use strict";
var config_1 = require("../app/config");
var users_1 = require("../app/users");
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
var appRoot = global.appRoot;
router.post("/setup", function (req, res) {
    var setupConfig = req.body;
    var configurationPath = global.serverAppRoot + "config\\config.json";
    var configurationObject = JSON.parse(fs.readFileSync(configurationPath, 'utf8').replace(/^\uFEFF/, ''));
    configurationObject["database"] = setupConfig["database"];
    if (configurationObject["database"].diskdb)
        fs.ensureDirSync(configurationObject["database"].diskdb.host);
    fs.writeFileSync(configurationPath, JSON.stringify(configurationObject), 'utf8');
    global.config = new config_1.config();
    var userObj = {
        Email: setupConfig.Email,
        Password: setupConfig.Password
    };
    users_1.users.register(userObj, function () {
        var setupConfigPath = global.clientAppRoot + "config\\setup.json";
        fs.writeFileSync(setupConfigPath, JSON.stringify({ active: new Date() }), 'utf8');
        res.status(200).json(setupConfig);
    });
});
module.exports = router;
