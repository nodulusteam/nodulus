/// <reference path="server/typings/main.d.ts" />
"use strict";
/// <reference path="server/typings/nodulus/nodulus.d.ts" />
/*                 _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016
 */


var path = require("path");

var envs = require('envs');
var nodulus = require("./server/app/startup");
global.appRoot = __dirname;
global.debug = function (...messages: Array<any>) { 
    if (envs("NODULUS_LOG") === "true")
        console.log(messages.join(' '));
};

global.serverAppRoot = path.join( __dirname ,  "server");
global.clientAppRoot = path.join(__dirname , "client");
global.nodulsRepo = path.join(__dirname ,  "nodulus_modules");
module.exports = new nodulus.Startup();




