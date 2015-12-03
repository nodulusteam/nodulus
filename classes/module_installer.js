var moduleInstaller = (function () {
    
    function _install(module_name) {
        var module = require(global.appRoot + "/console_modules/" + module_name +"/setup.js");
        module.install(module_name);
    }
    function _uninstall(module_name) {
    
    
    }

    return {
        install: _install,
        uninstall: _uninstall
    };
})();
// node.js module export
module.exports = moduleInstaller;