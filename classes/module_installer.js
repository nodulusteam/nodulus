var moduleInstaller = (function () {
    var fs = require("fs-extra");
    var JSZip = require("jszip");
    var dal = require("./dal.js");
    
    function _list(callback)
    {
         

        fs.readJson(global.appRoot + "\\modules.json", function (err, data) {
            
            callback(data);
             

        });

    }
    
    function _install(module_name, callback) {
        fs.ensureDirSync(global.appRoot + "\\public\\modules\\");
        fs.ensureDirSync(global.appRoot + "\\public\\modules\\" + module_name);
        
        // read a zip file
        fs.readFile(global.appRoot + "\\console_modules\\" + module_name + "\\" + module_name + ".zip", function (err, data) {
            if (err) throw err;
            var zip = new JSZip(data);
            for (var filename in zip.files) {
                var fileData = zip.file(filename).asText();
                fs.writeFileSync(global.appRoot + "\\public\\modules\\" + module_name + "\\" + filename, fileData, 'utf8');
            }
            //register the module to the modules.json file
            fs.ensureFileSync(global.appRoot + "\\modules.json");
            var modules_file = {};
            
            modules_file = fs.readJsonSync(global.appRoot + "\\modules.json");
            
            if (modules_file[module_name] === undefined) {
                modules_file[module_name] = {}
            }
            
            var manifest_file = fs.readJsonSync(global.appRoot + "\\public\\modules\\" + module_name + "\\manifest.json", { throws: false });
            //merge the manifest into the modules.json file
            if (manifest_file === null)
                callback("invalid json, try using ascii file");
            
            //update navigation 
            dal.connect(function (err, db) {
                
                for (var i = 0; i < manifest_file.navigation.length; i++) {
                    db.collection("Navigation").save(manifest_file.navigation[i]);
                }
            })
            
            
            modules_file[module_name] = manifest_file;
            
            if (manifest_file.npm !== undefined) {
                var arr = [];
                for (var x in manifest_file.npm) {
                    arr.push({ name: x, ver: manifest_file.npm[x] });
                }
                //install npm dependencies
                var async = require("async");
                async.each(arr, npm_install, function () {
                     
                     
                    fs.writeFileSync(global.appRoot + "\\modules.json", JSON.stringify(modules_file));
                    
                    callback(null, manifest_file);
                })


            }
            
            
            
            
            
            
           
        });
    }
    
    
    
    //var module = require(global.appRoot + "/console_modules/" + module_name +"/setup.js");
    //module.install(module_name);
    
    
    function npm_install(packagePair, callback) {
        var exec = require('child_process').exec,
            child;
        
        child = exec('npm install ' + packagePair.name +' --save',
 function (error, stdout, stderr) {
            
            callback(stderr, stdout);
                //console.log('stdout: ' + stdout);
                //console.log('stderr: ' + stderr);
                //if (error !== null) {
                //    console.log('exec error: ' + error);
                //}
        });
    }
    
    function _uninstall(module_name, callback) {
    
        var manifest_file = fs.readJsonSync(global.appRoot + "\\public\\modules\\" + module_name + "\\manifest.json", { throws: false });
        //merge the manifest into the modules.json file
        if (manifest_file === null)
            callback("invalid json, try using ascii file");
        
        modules_file = fs.readJsonSync(global.appRoot + "\\modules.json");
        
       
        
        dal.connect(function (err, db) {            
            for (var i = 0; i < manifest_file.navigation.length; i++) {
                db.collection("Navigation").remove({ "_id": manifest_file.navigation[i]._id }, function (err, data) { 
                
                
                });
            }
        })

        if (modules_file[module_name] !== undefined) {
            delete modules_file[module_name];
        }
        
        fs.writeFileSync(global.appRoot + "\\modules.json", JSON.stringify(modules_file));
        callback("ok");
    }
    
    return {
        list:_list,
        install: _install,
        uninstall: _uninstall
    };
})();
// node.js module export
module.exports = moduleInstaller;