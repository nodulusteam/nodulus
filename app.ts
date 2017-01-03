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
//var njstrace = require('njstrace').inject();
import {Startup} from './server/app/startup';
var path = require("path"); 
 
global.appRoot = __dirname;
global.serverAppRoot = path.join(__dirname, "server");
global.clientAppRoot = path.join(__dirname, "public");
global.nodulus = {};
module.exports = new Startup();




