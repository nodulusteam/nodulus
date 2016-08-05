"use strict";
const nodulus = require("./app/startup");
global.appRoot = __dirname;
module.exports = new nodulus.Startup();
