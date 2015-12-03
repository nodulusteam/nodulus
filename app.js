var express = require('express');
global.appRoot = __dirname;

var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var querystring = require('querystring');
var dal = require('./classes/dal.js');
var config = require('./classes/config.js'); 
var server = require('./classes/webServer.js');
var api = require('./classes/api.js');

 


var app = express();


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
for (var i = 0; i < config.modules().length; i++) {
    var module = config.modules()[i];
    app.use(module.route, require('./routes/' + module.path));

}

//app.use('/Users', require('./routes/users.js'));
server.start(app);
api.start(app);



config


module.exports = app;
