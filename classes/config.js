var _config = (function () {
    
    
    var util = require('util');
    var fs = require('fs');
    var path = require('path');  
 
    var obj = JSON.parse(fs.readFileSync(global.appRoot + '\\config\\site.json', 'utf8').replace(/^\uFEFF/, ''));
    var modules_in_config = obj.modules;
    //fs.readFile('./config/site.json', 'utf8', function (err, data) {
    //    if (err) throw err;
    //    obj = JSON.parse(data);
    //});   

    var private_variable = 'value';
    function private_function() {
        return obj;
    }
    function appSettings() {
      
        return obj;
    }
    
    function _modules() {
        
        return modules_in_config;

    }
    return {
        appSettings: private_function,
        modules: _modules

    };
})();
// node.js module export
module.exports = _config;