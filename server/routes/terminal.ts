/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
 
/// <reference path="../typings/main.d.ts" />
  
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var spawn = require('child_process').spawn;
 
global.terminals = {};
global["socket"].on('connection', function (socket: SocketIO.Socket) {
    global["rooms"][socket.id] = socket;
    socket.on('terminal.list', function (data: any) {
        if (global["terminals"]) {
            var retArr: any = [];
            for (var key in global["terminals"]) {
                retArr.push(key);
            }
            global["socket"].emit('terminal.list', { 'terminals': retArr });
        }
    });
    
    socket.on('terminal.init', function (data: any) {
        
        if (global["terminals"][data] === undefined) {
            var terminal = global["terminals"][data] = spawn('cmd', [], { stdio: ['pipe', 'pipe', 'pipe'] });
            terminal.id = data;
            
            
            terminal.stdout.on('data', function (data: any) {
                data = String.fromCharCode.apply(null, new Uint16Array(data));
                global["socket"].emit('terminal.result', { 'id': terminal.id, 'stdout': data, 'stderr': null });
            });
            
            terminal.stdout.on('message', function (data: any) {
                data = String.fromCharCode.apply(null, new Uint16Array(data));
                global["socket"].emit('terminal.result', { 'id': terminal.id, 'stdout': data, 'stderr': null });
            });
            
            terminal.stderr.on('data', function (data: any) {
                data = String.fromCharCode.apply(null, new Uint16Array(data));
                global["socket"].emit('terminal.result', { 'id': terminal.id, 'stdout': data, 'stderr': null });
            });
            
            terminal.stderr.on('close', function (data: any) {
                debugger;
            });
        }

       
        global["socket"].emit('terminal.init', { 'id': data });

       
    });
    
    socket.on('terminal.command', function (data: any) {
        var command = data.command + '\n';
        var terminal_id = data.id;
        var terminal = global["terminals"][terminal_id];
        terminal.stdin.setEncoding('utf-8');
        
        terminal.stdin.write(command);
        //

        //global["rooms"][socket.id]['terminal'](command, function (error, stdout, stderr) {
        //    socket.emit('terminal.result', { 'stdout': stdout, 'stderr': stderr } );
        //    console.log('stdout: ' + stdout);
        //    console.log('stderr: ' + stderr);
        //    if (error !== null) {
        //        console.log('exec error: ' + error);
        //    }
        //});

    });
});


function str2ab(str:string) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i > strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

module.exports = router;



