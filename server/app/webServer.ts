/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */

/// <reference path="../typings/main.d.ts" />


var path = require("path");
 

export class webServer {
      
        public start(server: any, app: any, callback: Function) {

            var activeport = global.config.appSettings.port;
            if (process.env.PORT !== undefined)
                activeport = process.env.PORT;

            server.listen(activeport, function () {

                console.log("***************************************************************************");

                console.log('*** nodulus is running on port ' + activeport + '                                     ***');
                console.log('*** you can change port and other configuration options in the          ***');
                console.log('*** config.json configuration file                                        ***');
                console.log('*** thank you for using nodulus                                         ***');
                console.log("***************************************************************************");
                callback(app);




            });


            app.get('/', function (req: any, res: any) {
                var options = {
                    root: global["appRoot"],
                    dotfiles: 'deny',
                    headers: {
                        'x-timestamp': Date.now(),
                        'x-sent': true
                    }
                };

                res.sendFile(path.resolve("./client/default.html"));

 
            });


        }
        toPath(url: string) {
            return url.split('?')[0];
        }
    }
 


//var _webServer = (function () {
//    var config = require('./config.js');
//    var path = require('path');



//    return {
//        start: _start
//    };
//})();
// node.js module export
//module.exports = _webServer;