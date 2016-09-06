"use strict";
var path = require("path");
var startup = require("./server/app/startup");
global.appRoot = __dirname;
global.serverAppRoot = path.join(__dirname, "server");
global.clientAppRoot = path.join(__dirname, "public");
module.exports = new startup.Startup();
