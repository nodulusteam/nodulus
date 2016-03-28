var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
var config = require('../app/config.js');
var dal = require("../app/dal.js");
var appRoot = global["appRoot"];
router.post("/setup", function (req, res) {
    var setupConfig = req.body;
    var setupConfigPath = appRoot + "\\public\\config\\setup.json";
    fs.writeFileSync(setupConfigPath, JSON.stringify({ active: new Date() }), 'utf8');
    var configurationPath = appRoot + "\\config\\config.json";
    var configurationObject = JSON.parse(fs.readFileSync(configurationPath, 'utf8').replace(/^\uFEFF/, ''));
    configurationObject["database"] = setupConfig["database"];
    fs.writeFileSync(configurationPath, JSON.stringify(configurationObject), 'utf8');
    var userObj = {
        Email: setupConfig.Email,
        Password: setupConfig.Password
    };
    var userDB = require("../app/users").users;
    userDB.register(userObj, function () {
        res.status(200).json(setupConfig);
    });
});
module.exports = router;
