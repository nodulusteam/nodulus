/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */


/// <reference path="../typings/node/node.d.ts" /> 
var _webServer = (function () {
    var config = require('./config.js');
    var path = require('path');
    
    function _start(server, app, callback) {
        
        var activeport = config.appSettings().port;
        if (process.env.PORT !== undefined)
            activeport = process.env.PORT;
        
        server.listen(activeport, function () {
            
            console.log("***************************************************************************");

            console.log('*** nodulus is running on port ' + activeport +'                                     ***');
            console.log('*** you can change port and other configuration options in the          ***');
            console.log('*** config.json configuration file                                        ***');
            console.log('*** thank you for using nodulus                                         ***');
            console.log("***************************************************************************");
            callback(app);
            
            

            
        });
        
        
        app.get('/', function (req, res) {
            var options = {
                root: global["appRoot"],
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            
           res.sendFile(path.resolve("client/default.html"));
            
            //res.set('Content-Type',  mimeTypes[req.route.path.replace("/*", "")]);
           // res.sendFile(_toPath("../client/default.html"), options);
        });


    }
    
    function _toPath(url) {
        return url.split('?')[0];

    }
    
    return {
        start: _start
    };
})();
// node.js module export
module.exports = _webServer;