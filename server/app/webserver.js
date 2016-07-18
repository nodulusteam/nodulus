"use strict";
var path = require("path");
class webServer {
    start(server, app, callback) {
        var activeport = global.config.appSettings.port;
        if (process.env.PORT !== undefined)
            activeport = process.env.PORT;
        server.listen(activeport, function () {
            console.log("***************************************************************************");
            console.log('*** nodulus is running on port ' + activeport + ' ------------------------------------***');
            console.log('*** you can change port and other configuration options in the ---------***');
            console.log('*** server/config.json configuration file ------------------------------***');
            console.log('*** thank you for using nodulus ----------------------------------------***');
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
            res.sendFile(path.resolve("./client/default.html"));
        });
    }
    toPath(url) {
        return url.split('?')[0];
    }
}
exports.webServer = webServer;
