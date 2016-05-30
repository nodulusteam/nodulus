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
import * as configuration from "./config";
import * as web from "./webserver";
import * as network from "./socket";
import * as rest from "./api";
//import * as bodyParser from "body-parser";
//import errorHandler = require("errorhandler");
//import methodOverride = require("method-override");

//import * as routes from "./routes/index";
//import * as db from "./db";



export class Startup {
    constructor() {
        
        var fs = require('fs');
        var path = require('path');
        var express = require('express');

        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var url = require('url');
        var querystring = require('querystring');

        global.config = new configuration.config();

        //var dal = new nodulus.data.dal();// require('./dal.js');
        //var config = require('./config.js');
        
        var webServer = new web.webServer();
        //var api = require('./api.js');


        var EventEmitter = require('events').EventEmitter;
        global.eventServer = new EventEmitter();
        var app = express();

        var http = require("http").createServer(app);
        var server = require('http').Server(app);

        if (global.config.enableSockets) {
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
        var nodulus_modules = global.config.modulesSettings;


        console.log("");



        console.log("***************************************************************************");
        console.log("***__active nodules_____________________________________________________***");
        console.log("***_____________________________________________________________________***");
        for (var name of Object.keys(nodulus_modules)) {
            var nodulus_module = nodulus_modules[name];

            console.log("***__ " + name + " " + this.print("_", 65 - name.length) + "***");



            if (nodulus_module.routes !== undefined) {
                for (var x = 0; x < nodulus_module.routes.length; x++) {
                    app.use(nodulus_module.routes[x].route, require('../routes/' + nodulus_module.routes[x].path));
                }
            }

        }

        console.log("***_____________________________________________________________________***");

        app.use("/nodulus", require('../routes/nodulus.js'));
        var a = new rest.api();
       
        a.start(app);
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
