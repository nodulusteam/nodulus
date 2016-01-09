var express = require('express');
global.appRoot = __dirname;

var fs = require('fs');
var path = require('path');


var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var querystring = require('querystring');
var dal = require('./classes/dal.js');
var config = require('./classes/config.js');
var SocketUse = require('./classes/socket.js');
var webServer = require('./classes/webServer.js');
var api = require('./classes/api.js');


var EventEmitter = require('events').EventEmitter;
global.eventServer = new EventEmitter();

var app = express();


var http = require("http").createServer(app);
var io = require("socket.io")(http);
//http.listen(8080, "127.0.0.1");




 


var server = require('http').Server(app);
webServer.start(server, app, function () {
    
    var socket = require('socket.io')(server);
    var io = socket.listen(server);
    
    console.log("*** websocket is active");
    SocketUse(io);

});
//app.use('/Users', require('./routes/users.js'));


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
app.use('/', express.static(__dirname + '/public'));


//load modules
var modules = config.modules();
console.log("*** active nodules");
for (var name in modules) {
    var module = modules[name];
    console.log("*** " + name);
    
    if (module.routes !== undefined) {
        for (var x = 0; x < module.routes.length; x++) {
            app.use(module.routes[x].route, require('./routes/' + module.routes[x].path));
        }
    }

}




api.start(app);






module.exports = app;
