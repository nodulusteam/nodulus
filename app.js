"use strict";
var path = require("path");
var envs = require('envs');
var startup = require("./server/app/startup");
global.appRoot = __dirname;
global.debug = function (...messages) {
    if (envs("NODULUS_LOG") === "true")
        console.log(messages.join(' '));
};
global.serverAppRoot = path.join(__dirname, "server");
global.clientAppRoot = path.join(__dirname, "client");
global.nodulsRepo = path.join(__dirname, "nodulus_modules");
module.exports = new startup.Startup();
