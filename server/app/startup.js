"use strict";
var config = require("@nodulus/config");
var consts = config.consts;
var modules = require("@nodulus/modules");
var path = require("path");
var rest = require("@nodulus/api");
var Startup = (function () {
    function Startup() {
        var log = require("@nodulus/logs").logger;
        var core = require("@nodulus/core");
        var io = require("@nodulus/socket")(core.server);
        core.use('/', core.static(global.clientAppRoot));
        var nodulus_modules = config.modulesSettings;
        console.log("");
        console.log("***************************************************************************");
        console.log("***__active nodules_____________________________________________________***");
        console.log("***_____________________________________________________________________***");
        var baseFolderForStatic = process.cwd();
        if (process.env.NODULUS_MODE === 'global') {
            baseFolderForStatic = process.env.NODULUS_GLOBALPATH;
        }
        console.log(baseFolderForStatic);
        for (var _i = 0, _a = Object.keys(nodulus_modules); _i < _a.length; _i++) {
            var name = _a[_i];
            var nodulus_module = nodulus_modules[name];
            try {
                var version = require(name + '/package.json').version;
                console.log("***__ " + name + " " + this.print("_", 55 - name.length) + "**" + version + this.print("_", 8 - version.length) + "***");
                var npmname = name;
                if (nodulus_module.routes !== undefined) {
                    for (var x = 0; x < nodulus_module.routes.length; x++) {
                        try {
                            var pathRoute = npmname + '/' + 'routes/' + nodulus_module.routes[x].path;
                            core.use('/' + npmname + nodulus_module.routes[x].route, require(pathRoute));
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                core.use('/' + name, core.static(path.join(baseFolderForStatic, 'node_modules', name, 'public')));
            }
            catch (err) {
                log.error('missing module', err);
            }
        }
        console.log("***_____________________________________________________________________***");
        core.use("/nodulus", require('../routes/nodulus.js'));
        var api = rest.start(core);
        console.log("***_____________________________________________________________________***");
        if (process.env.NODE_ENV === 'development') {
            core.use('/', core.static(path.join(baseFolderForStatic, 'bower_components')));
        }
        core.use('/', core.static(path.join(baseFolderForStatic, 'public')));
        core.use('/nodulus.json', function (req, res) {
            res.sendFile(path.join(process.cwd(), './nodulus.json'));
        });
    }
    Startup.prototype.print = function (char, num) {
        var str = "";
        for (var i = 0; i < num; i++)
            str += char;
        return str;
    };
    return Startup;
}());
exports.Startup = Startup;
//# sourceMappingURL=startup.js.map