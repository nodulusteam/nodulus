var config = require("@nodulus/config").config;
var consts = require("@nodulus/config").consts;
var dal = require("@nodulus/data");
var users = require("@nodulus/users");
var core = require("@nodulus/core");
var router = core.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
router.post("/setup", function (req, res) {
    var setupConfig = req.body;
    config["database"] = setupConfig["database"];
    if (config["database"].diskdb)
        fs.ensureDirSync(config["database"].diskdb.host);
    config.persistConfiguration();
    var userObj = {
        Email: setupConfig.Email,
        Password: setupConfig.Password
    };
    users.register(userObj, function () {
        var setupConfigPath = path.join(process.cwd(), "nodulus.json");
        fs.writeFileSync(setupConfigPath, JSON.stringify({ active: new Date() }), 'utf8');
        res.status(200).json(setupConfig);
    });
});
module.exports = router;
//# sourceMappingURL=nodulus.js.map