"use strict";

var consts = require("@nodulus/config").consts;
var config = require("@nodulus/config").config;
const web = require("./webserver");
const network = require("./socket");
var rest = require("@nodulus/api");
var modules = require("@nodulus/modules");

class Startup {
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
        var EventEmitter = require('events').EventEmitter;
        global.eventServer = new EventEmitter();
        var app = express();
        global.express = app;
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
        webServer.start(server, app, function (app) {
        });
        var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
        app.use(bodyParser.json({
            reviver: function (key, value) {
                var match;
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
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        app.use('/', express.static(global.clientAppRoot));
        var nodulus_modules = config.modulesSettings;
        console.log("");
        console.log("***************************************************************************");
        console.log("***__active nodules_____________________________________________________***");
        console.log("***_____________________________________________________________________***");
        for (var name of Object.keys(nodulus_modules)) {
            var nodulus_module = nodulus_modules[name];
            try {
                var version = require(name + '/package.json').version;
                console.log("***__ " + name + " " + this.print("_", 55 - name.length) + "**" + version + this.print("_", 8 - version.length) + "***");
                var npmname = name;
                if (nodulus_module.routes !== undefined) {
                    for (var x = 0; x < nodulus_module.routes.length; x++) {
                        try {
                            var pathRoute = npmname + '/' + 'routes/' + nodulus_module.routes[x].path;
                            app.use('/' + npmname + nodulus_module.routes[x].route , require(pathRoute));

                          
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                app.use('/' + name , express.static(path.join(process.cwd(), 'node_modules', name, 'public')));
            }
            catch (err) {
                log.error('missing module', err);
            }
        }
        console.log("***_____________________________________________________________________***");
        app.use("/nodulus", require('../routes/nodulus.js'));
        var api = new rest.start(app);
        console.log("***_____________________________________________________________________***");
    }
    print(char, num) {
        var str = "";
        for (var i = 0; i < num; i++)
            str += char;
        return str;
    }
}
exports.Startup = Startup;
