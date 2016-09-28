/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */


/// <reference path="../typings/main.d.ts" />


var config = require("@nodulus/config").config;
var consts = require("@nodulus/config").consts;
var dal = require("@nodulus/data");
var users = require("@nodulus/users");



var express = require("@nodulus/core");
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');



router.post("/setup", function (req: any, res: any) {
    var setupConfig = req.body;
    config["database"] = setupConfig["database"];
    if (config["database"].diskdb)
        fs.ensureDirSync(config["database"].diskdb.host);

    config.persistConfiguration();


    var userObj = {
        Email: setupConfig.Email,
        Password: setupConfig.Password

    }

    //register the default user    
    users.register(userObj, function () {
        var setupConfigPath = path.join(process.cwd(), "nodulus.json");
        fs.writeFileSync(setupConfigPath, JSON.stringify({ active: new Date() }), 'utf8');
        res.status(200).json(setupConfig);
    })
});
module.exports = router;