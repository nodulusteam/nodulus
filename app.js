"use strict";
var nodulus = require("./server/app/startup");
global.appRoot = __dirname;
global.serverAppRoot = __dirname + "\\server\\";
global.clientAppRoot = __dirname + "\\client\\";
global.nodulsRepo = __dirname + "\\nodulus_modules\\";
module.exports = new nodulus.Startup();
