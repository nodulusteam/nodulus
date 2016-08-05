"use strict";
class socket {
    constructor(io) {
        global.rooms = {};
        global.io = io;
        io.on('connection', function (socket) {
            global.rooms[socket.id] = socket;
            socket.on('console connect', function (data) {
                socket.emit('console connected', data);
            });
        });
    }
}
exports.socket = socket;
