/// <reference path="../typings/main.d.ts" />
/*                _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016
 */


import * as http from "http";
import * as url from "url";



const config = require("@nodulus/config");
const consts = config.consts;
const modules = require("@nodulus/modules");
const path = require("path");
const rest = require("@nodulus/api");
const nodulusInit = require("@nodulus/core");

export class Startup {
    constructor() {



        var log = require("@nodulus/logs").logger;
        var app = require("@nodulus/core");
        var io = require("@nodulus/socket")(app.server);
        app.use('/', app.static(global.clientAppRoot));
        //load modules
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
        for (var name of Object.keys(nodulus_modules)) {
            var nodulus_module = nodulus_modules[name];
            try {
                var version = require(name + '/package.json').version;
                console.log("***__ " + name + " " + this.print("_", 55 - name.length) + "**" + version + this.print("_", 8 - version.length) + "***");
                var npmname = name;//nodulus_module.npm;
                if (nodulus_module.routes !== undefined) {
                    for (var x = 0; x < nodulus_module.routes.length; x++) {
                        try {
                            var pathRoute = npmname + '/' + 'routes/' + nodulus_module.routes[x].path;
                            app.use('/' + npmname + nodulus_module.routes[x].route, require(pathRoute));
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                app.use('/' + name, app.static(path.join(baseFolderForStatic, 'node_modules', name, 'public')));
            }
            catch (err) {
                log.error('missing module', err);

            }
        }

        console.log("***_____________________________________________________________________***");
        app.use("/nodulus", require('../routes/nodulus.js'));
        var api = new rest.start(app);
        console.log("***_____________________________________________________________________***");
        app.use('/', app.static(path.join(baseFolderForStatic, 'bower_components')));
        app.use('/', app.static(path.join(baseFolderForStatic, 'public')));

        app.use('/nodulus.json', (req: any, res: any) => {
            res.sendFile(path.join(process.cwd(), './nodulus.json'));

        })


    }

    print(char: string, num: number): string {
        var str: string = "";
        for (var i = 0; i < num; i++)
            str += char;
        return str;
    }
}
