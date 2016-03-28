/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
/// <reference path="../typings/main.d.ts" />

 
    export class socket {
        constructor(io: SocketIO.Server) {
            global.rooms = {};
            io.on('connection', function (socket: any) {


                global.rooms[socket.id] = socket;


                socket.on('console connect', function (data: any) {
                    socket.emit('console connected', data);

                });


            });
        }
    }
 

