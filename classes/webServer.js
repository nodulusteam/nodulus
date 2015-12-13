var _webServer = (function () {    
    var config = require('./config.js');   
    function _start(app, callback) {
        app.listen(config.appSettings().port, function () {
            
            console.log('Console is listening on port ' + config.appSettings().port);
            callback(app);
            
            

            
        });
    }
    return {
        start: _start
    };
})();
// node.js module export
module.exports = _webServer;