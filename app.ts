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
var startup = require("./server/app/startup");
global.appRoot = __dirname;
global.serverAppRoot = path.join(__dirname, "server");
global.clientAppRoot = path.join(__dirname, "client");

module.exports = new startup.Startup();




