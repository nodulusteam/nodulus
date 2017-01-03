"use strict";
var startup_1 = require("./server/app/startup");
var path = require("path");
global.appRoot = __dirname;
global.serverAppRoot = path.join(__dirname, "server");
global.clientAppRoot = path.join(__dirname, "public");
global.nodulus = {};
module.exports = new startup_1.Startup();
//# sourceMappingURL=app.js.map