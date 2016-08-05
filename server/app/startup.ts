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
import * as express from "express";
var configuration = require("@nodulus/config").config;
var consts = require("@nodulus/config").consts;
var config = require("@nodulus/config").config;



import * as web from "./webserver";
import * as network from "./socket";
var rest = require("@nodulus/api");

export class Startup {
    constructor() {
        var fs = require('fs');
        var path = require('path');
        var express = require('express');

        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var url = require('url');
        var querystring = require('querystring');
        var envs = require('envs');


        var log = require("@nodulus/logs").logger;
        var webServer = new web.webServer();
        //var api = require('./api.js');


        var EventEmitter = require('events').EventEmitter;
        global.eventServer = new EventEmitter();
        var app = express();
        global.express = app;


        // If NODE_ENV is not set, 
        // then this application will assume it's prod by default.
        app.set('environment', envs('NODE_ENV', 'production'));


        var http = require("http").createServer(app);
        var server = require('http').Server(app);

        if (config.appSettings.enableSockets) {
            var socket = require('socket.io');
            var io = socket.listen(server);
            global.socket = io;
            console.log("*** websocket is active");
            var SocketUse = new network.socket(io);

        }



        webServer.start(server, app, function (app: any) {
        });


        var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
        app.use(bodyParser.json({
            reviver: function (key: string, value: any) {
                var match: any;
                if (typeof value === "string" && (match = value.match(regexIso8601))) {
                    var milliseconds = Date.parse(match[0]);
                    if (!isNaN(milliseconds)) {
                        return new Date(milliseconds);
                    }
                }
                return value;
            },
            limit: '50mb',
        }));
        app.use(bodyParser.json()); // for parsing application/json
        app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        app.use('/', express.static(global.clientAppRoot));
        //global.clientAppRoot = path.resolve('./client/');

        //load modules
        var nodulus_modules = config.modulesSettings;


        console.log("");



        console.log("***************************************************************************");
        console.log("***__active nodules_____________________________________________________***");
        console.log("***_____________________________________________________________________***");
        for (var name of Object.keys(nodulus_modules)) {
            var nodulus_module = nodulus_modules[name];
            try {
                var version = require('@nodulus/' + name + '/package.json').version;

                console.log("***__ " + name + " " + this.print("_", 55 - name.length) + "**" + version + this.print("_", 8 - version.length) + "***");

                var npmname = '@nodulus/' + name;//nodulus_module.npm;

                if (nodulus_module.routes !== undefined) {
                    for (var x = 0; x < nodulus_module.routes.length; x++) {
                        try {

                            var pathRoute = path.join(npmname, 'routes', nodulus_module.routes[x].path);
                            app.use(nodulus_module.routes[x].route, require(pathRoute));
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }


                app.use('/modules/' + name, express.static(path.join('node_modules', '@nodulus', name, 'public')));
            }
            catch (err) {
                log.error('missing module', err);

            }
        }

        console.log("***_____________________________________________________________________***");

        app.use("/nodulus", require('../routes/nodulus.js'));

        var api = new rest.start(app);

        console.log("***_____________________________________________________________________***");
        // app.use(require("nodulus-run"));


    }

    print(char: string, num: number): string {
        var str: string = "";
        for (var i = 0; i < num; i++)
            str += char;

        return str;


    }
}
