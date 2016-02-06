/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
/// <reference path="../typings/node/node.d.ts" />

 
var express = require('express');
var fs = require('fs');
var path = require('path');


var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var querystring = require('querystring');
var dal = require('./dal.js');
var config = require('./config.js');
var SocketUse = require('./socket.js');
var webServer = require('./webServer.js');
var api = require('./api.js');


var EventEmitter = require('events').EventEmitter;
global["eventServer"] = new EventEmitter();

var app = express();


var http = require("http").createServer(app);
var server = require('http').Server(app);
webServer.start(server, app, function (app) {

    var socket = require('socket.io');
    var io = socket.listen(server);

    console.log("*** websocket is active");
    SocketUse(io);

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
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/', express.static(global["appRoot"] + '/public'));


//load modules
var nodulus_modules = config.modules();
console.log("*** active nodules");
for (var name of Object.keys(nodulus_modules)) {
    var nodulus_module = nodulus_modules[name];
    console.log("*** " + name);

    if (nodulus_module.routes !== undefined) {
        for (var x = 0; x < nodulus_module.routes.length; x++) {
            app.use(nodulus_module.routes[x].route, require('../routes/' + nodulus_module.routes[x].path));
        }
    }

}




api.start(app);

app.use(require("nodulus-run"));



module.exports = app;