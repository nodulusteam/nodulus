var socketuse = function (io) {    
    var dal = require('./dal');    
    var rooms = [];
    io.on('connection', function (socket) {
        
        
        socket.on('console connect', function (data) {
            var xx = 1;
            socket.emit('console connected', data);
             
        });
    });
    
    
    
    
}





module.exports = socketuse;