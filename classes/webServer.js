var _webServer = (function () {    
    var config = require('./config.js');   
    function _start(server, app, callback) {
        
        var activeport = config.appSettings().port;
        if (process.env.PORT !== undefined)
            activeport = process.env.PORT;
       
        server.listen(activeport, function () {
            
            console.log('nodulus is listening on port ' + activeport);
            callback(app);
            
            

            
        });


        app.get('/', function (req, res) {
            var options = {
                root: global.appRoot,
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                }
            };
            
            //res.set('Content-Type',  mimeTypes[req.route.path.replace("/*", "")]);
            res.sendFile(_toPath("/public/default.html"), options);
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