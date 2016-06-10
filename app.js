"use strict";
var envs = require('envs');
var nodulus = require("./server/app/startup");
global.appRoot = __dirname;
global.debug = function () {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i - 0] = arguments[_i];
    }
    if (envs("NODULUS_LOG") === "true")
        console.log(messages.join(' '));
};
global.serverAppRoot = __dirname + "\\server\\";
global.clientAppRoot = __dirname + "\\client\\";
global.nodulsRepo = __dirname + "\\nodulus_modules\\";
module.exports = new nodulus.Startup();
