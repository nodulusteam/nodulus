/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
/// <reference path="../typings/node/node.d.ts" /> 
global["rooms"] = {};

var socketuse = function (io) {    
    //var dal = require('./dal');    
    //var rooms = [];
   
    io.on('connection', function (socket) {

        
        global["rooms"][socket.id] = socket;


        socket.on('console connect', function (data) {
            socket.emit('console connected', data);

        });

        
    });




}





module.exports = socketuse;