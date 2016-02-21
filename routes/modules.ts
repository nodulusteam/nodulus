/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
/// <reference path="../typings/node/node.d.ts" />  
var express = require('express');
var router = express.Router();
var util = require('util');
var path = require('path');
var dal = require("../classes/dal.js");
var fs = require("fs-extra");
var JSZip = require("jszip");
var moment = require('moment');

var appRoot = global["appRoot"];

class ModuleUtiliity  {
    
    constructor() {
        
    }
    /**
     * install the module package
     * @param module_name
     * @param callback
     */
    install(module_name, callback) {
        var instance = this;
        var baseFolder = appRoot + "\\public\\modules\\" + module_name + "\\";

        fs.ensureDirSync(appRoot + "\\public\\modules\\");
        fs.ensureDirSync(baseFolder);
    
        // read a zip file
        fs.readFile(appRoot + "\\nodulus_modules\\" + module_name + ".zip", function (err, data) {
            if (err) throw err;

            var zip = new JSZip(data);
            var fileData = zip.file("manifest.json").asText();
            fs.writeFileSync(baseFolder + "\\manifest.json", fileData, 'utf8');
            var manifest_file = fs.readJsonSync(baseFolder + "\\manifest.json", { throws: true });


            if (manifest_file.files !== undefined) {
                for (var i = 0; i < manifest_file.files.length; i++) {
                    var filename = manifest_file.files[i];
                    if (zip.file(filename)) {
                        var fileData = zip.file(filename).asText();
                        fs.writeFileSync(baseFolder + "\\" + filename, fileData, 'utf8');
                    }

                }
            }

            if (manifest_file.routes !== undefined) {
                for (var i = 0; i < manifest_file.routes.length; i++) {
                    var filename = manifest_file.routes[i].path;
                    if (zip.folder("routes").file(filename)) {
                        var fileData = zip.folder("routes").file(filename).asText();
                        fs.writeFileSync(appRoot + "\\routes\\" + filename, fileData, 'utf8');
                    }

                }
            }

            if (manifest_file.scripts !== undefined) {
                fs.ensureDirSync(baseFolder + "\\scripts\\");
                for (var i = 0; i < manifest_file.scripts.length; i++) {
                    var filename = manifest_file.scripts[i];
                    if (zip.folder("scripts").file(filename)) {
                        var fileData = zip.folder("scripts").file(filename).asText();
                        fs.writeFileSync(baseFolder + "\\scripts\\" + filename, fileData, 'utf8');
                    }

                }
            }


            var aboutfilename = "about.html";
            if (zip.file(aboutfilename) !== null) {
                var fileData = zip.file(aboutfilename).asText();
                fs.writeFileSync(baseFolder + aboutfilename, fileData, 'utf8');
            }
        
        
        
        
        
        
            //register the module to the modules.json file
            fs.ensureFileSync(appRoot + "\\modules.json");
            var modules_file = {};

            modules_file = fs.readJsonSync(appRoot + "\\modules.json");

            if (modules_file[module_name] === undefined) {
                modules_file[module_name] = {}
            }
        
        
            //merge the manifest into the modules.json file
            if (manifest_file === null)
                callback("invalid json, try using ascii file");
        
            //update navigation
            if (manifest_file.navigation)
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
                async.each(arr, instance.npm_install, function () {


                    fs.writeFileSync(appRoot + "\\modules.json", JSON.stringify(modules_file));

                    callback(null, manifest_file);
                })


            }
            else {
                fs.writeFileSync(appRoot + "\\modules.json", JSON.stringify(modules_file));
                callback(null, manifest_file);
            }







        });
    }
    /**
     * uninstall the module package
     * @param module_name
     * @param callback
     */
    uninstall(module_name, callback) {
        var modules_file = fs.readJsonSync(appRoot + "\\modules.json");
        if (modules_file[module_name] !== undefined) {

            for (var i = 0; i < modules_file[module_name].routes.length; i++) {
                fs.unlinkSync(appRoot + "\\routes\\" + modules_file[module_name].routes[i].path);
            }



            delete modules_file[module_name];
        }







        fs.writeFileSync(appRoot + "\\modules.json", JSON.stringify(modules_file));


        try {
            var manifest_file = fs.readJsonSync(appRoot + "\\public\\modules\\" + module_name + "\\manifest.json", { throws: false });
            //merge the manifest into the modules.json file
            if (manifest_file === null)
                callback("invalid json, try using ascii file");




            dal.connect(function (err, db) {
                if (manifest_file.navigation) {
                    for (var i = 0; i < manifest_file.navigation.length; i++) {
                        db.collection("Navigation").remove({ "_id": manifest_file.navigation[i]._id }, function (err, data) {


                        });
                    }
                }

            })
        
        
            //delete module folder
            this.deleteFolderRecursive(appRoot + "\\public\\modules\\" + module_name + "\\");




            callback("ok");
        }
        catch (e) {
            callback("ok");
        }
    }

timestamp() : string
{
var date = new Date();
var components = [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
];

return components.join("");

    };
npm_install(packagePair, callback) {
    var exec = require('child_process').exec,
        child;
    
    child = exec('npm install ' + packagePair.name + ' --save',
       function (error, stdout, stderr) {
        
        callback(stderr, stdout);
                //console.log('stdout: ' + stdout);
                //console.log('stderr: ' + stderr);
                //if (error !== null) {
                //    console.log('exec error: ' + error);
                //}
    });
};
 replaceAll(replaceThis, withThis, inThis) {
    withThis = withThis.replace(/\$/g, "$$$$");
    return inThis.replace(new RegExp(replaceThis.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g, "\\$&"), "g"), withThis);
};
deleteFolderRecursive (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                this.deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
list(callback) {
    
    
    fs.readJson(appRoot + "\\modules.json", function (err, data) {
        
        callback(data);


    });

}
validateModuleName(module_name, callback) {
    
    if (fs.existsSync(appRoot + "/nodulus_modules/" + module_name + ".zip")) {
        return callback(true);
    }
    return callback(false);
}
createPackage(module_name, callback) {
    var baseFolder = appRoot + "\\public\\modules\\modules\\template\\";
    var manifest_file = fs.readJsonSync(baseFolder + "manifest.json", { throws: false });
    
    var manifestString = JSON.stringify(manifest_file);
    manifestString = this.replaceAll("$$module_name$$", module_name, manifestString);
    manifest_file = JSON.parse(manifestString);
    
    ////for (var i = 0; i < manifest_file.files.length; i++) {
    ////    manifest_file.files[i] = manifest_file.files[i].replace("$$module_name$$" , module_name);
    
    ////}
    
    ////for (var i = 0; i < manifest_file.scripts.length; i++) {
    ////    manifest_file.scripts[i] = manifest_file.scripts[i].replace("$$module_name$$" , module_name);
    
    ////}
    
    ////for (var i = 0; i < manifest_file.routes.length; i++) {
    ////    manifest_file.routes[i].route = manifest_file.routes[i].route.replace("$$module_name$$" , module_name);
    ////    manifest_file.routes[i].path = manifest_file.routes[i].path.replace("$$module_name$$" , module_name);
    
    ////}
    
    ////for (var i = 0; i < manifest_file.navigation.length; i++) {
    ////    manifest_file.navigation[i].route = manifest_file.routes[i].route.replace("$$module_name$$" , module_name);
    ////    manifest_file.navigation[i].path = manifest_file.routes[i].path.replace("$$module_name$$" , module_name);
    
    ////}
    
    
    
    var zip = new JSZip();
    var filesArr = [];
    
    var fileContent = fs.readFileSync(baseFolder + "\\template.js", "utf-8");
    fileContent = this.replaceAll("$$module_name$$", module_name, fileContent);
    zip.file(module_name + ".js" , fileContent);
    
    var fileContent = fs.readFileSync(baseFolder + "\\template.html", "utf-8");
    fileContent = this.replaceAll("$$module_name$$", module_name, fileContent);
    zip.file(module_name + ".html" , fileContent);
    
    zip.file("manifest.json" , JSON.stringify(manifest_file));
    
    
    
    
    var fileContent = fs.readFileSync(baseFolder + "\\about.html", "utf-8");
    fileContent = this.replaceAll("$$module_name$$", module_name, fileContent);
    zip.file("about.html", fileContent);
    
    
    
    var fileContent = fs.readFileSync(baseFolder + "\\routes\\template.js");
    zip.folder("routes").file(module_name + ".js", fileContent);
    
    
    //get manifest template:
    var content = zip.generate({ type : "nodebuffer" });
    var packageFileName = appRoot + "/nodulus_modules/" + module_name + ".zip";
    var packageBackupFileName = appRoot + "/nodulus_modules/" + module_name + "/" + module_name + "." + this.timestamp() + ".zip";
    
    if (fs.existsSync(packageFileName)) {
        fs.ensureDirSync(appRoot + "/nodulus_modules/" + module_name);
        fs.renameSync(packageFileName, packageBackupFileName);
    }
    
    
    //var oldPackage  = fs.readFileSync(global.appRoot + "/nodulus_modules/" + module_name + ".zip");
    
    // see FileSaver.js
    fs.writeFile(packageFileName, content, function (err) {
        if (err) throw err;
        callback(null, manifest_file);
    });
}
pack(module_name, callback) {
    var baseFolder = appRoot + "\\public\\modules\\" + module_name + "\\";
    var manifest_file = fs.readJsonSync(baseFolder + "manifest.json", { throws: false });
    //merge the manifest into the modules.json file
    if (manifest_file === null)
        callback("invalid json, try using ascii file");
    
    
    var zip = new JSZip();
    var filesArr = [];
    for (var i = 0; i < manifest_file.files.length; i++) {
        if (fs.existsSync(baseFolder + manifest_file.files[i])) {
            var fileContent = fs.readFileSync(baseFolder + manifest_file.files[i]);
            zip.file(manifest_file.files[i], fileContent);


        }
             

    }
    
    if (manifest_file.routes !== undefined) {
        for (var i = 0; i < manifest_file.routes.length; i++) {
            if (fs.existsSync(appRoot + "/routes/" + manifest_file.routes[i].path)) {
                var fileContent = fs.readFileSync(appRoot + "/routes/" + manifest_file.routes[i].path);
                zip.folder("routes").file(manifest_file.routes[i].path, fileContent);
            }
            
            var tsfile = appRoot + "/routes/" + manifest_file.routes[i].path.replace('.js', '.ts');
            if (fs.existsSync(tsfile)) {
                var fileContent = fs.readFileSync(tsfile);
                zip.folder("routes").file(manifest_file.routes[i].path.replace('.js', '.ts'), fileContent);
            }


        }
    }
    
    
    if (manifest_file.scripts !== undefined) {
        for (var i = 0; i < manifest_file.scripts.length; i++) {
            if (fs.existsSync(baseFolder + "/scripts/" + manifest_file.scripts[i])) {
                var fileContent = fs.readFileSync(baseFolder + "/scripts/" + manifest_file.scripts[i]);
                zip.folder("scripts").file(manifest_file.scripts[i], fileContent);
            }
        }
    }
    
    
    
    
    
    if (fs.existsSync(baseFolder + "about.html")) {
        var fileContent = fs.readFileSync(baseFolder + "about.html");
        zip.file("about.html", fileContent);
    }
    
    
    
    
    var manifestContent = fs.readFileSync(baseFolder + "manifest.json");
    zip.file("manifest.json", manifestContent);
    
    
    var content = zip.generate({ type : "nodebuffer" });
    var packageFileName = appRoot + "/nodulus_modules/" + module_name + ".zip";
    var packageBackupFileName = appRoot + "/nodulus_modules/" + module_name + "/" + module_name + "." + this.timestamp() + ".zip";
    
    if (fs.existsSync(packageFileName)) {
        fs.ensureDirSync(appRoot + "/nodulus_modules/" + module_name);
        fs.renameSync(packageFileName, packageBackupFileName);
    }
    
    
    //var oldPackage  = fs.readFileSync(global.appRoot + "/nodulus_modules/" + module_name + ".zip");
    
    // see FileSaver.js
    fs.writeFile(packageFileName, content, function (err) {
        if (err) throw err;
        callback(null, manifest_file);
    });



}



 
};

router.get("/listsearch", function (req, res) {
    //var glob = require("glob")
    
    fs.readdir(appRoot + "\\nodulus_modules\\", function (err, files) {
        var arrRes = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].indexOf(".zip") > -1 && files[i].indexOf(req.query.name) > -1)
                arrRes.push(files[i].replace(".zip", ""))
        }
        res.json(arrRes);
    });
    
    
//     // options is optional
//     glob(appRoot + "\\nodulus_modules\\*" + req.query.name + "*/*.zip",  function (er, files) {
//         res.json(files);
//   // files is an array of filenames.
//   // If the `nonull` option is set, and nothing
//   // was found, then files is ["**/*.js"]
//   // er is an error object or null.
//     })
    

     
});


//var moduleUtility = new ModuleUtiliity();
router.get("/navigation", function (req, res) {
     
    new ModuleUtiliity().list(function (data) {
        var arr = [];
        for (var x in data) {
            if (data[x].modules_navigation)
                arr.push(data[x].modules_navigation[0]);
        }
        
        res.json(arr);
    
    })
});
router.get("/list", function (req, res) {
    
    new ModuleUtiliity().list(function (data) {
        var arr = [];
        for (var x in data) {
            arr.push(data[x]);
        }
        
        res.json(arr);
    
    })
})
router.get("/listnav", function (req, res) {

    new ModuleUtiliity().list(function (data) {
        var arr = [];
        for (var x in data) {
            if (data[x].navname !== undefined)
                    arr.push(data[x]);
        }

        res.json(arr);

    })
})
 
router.get("/nodulus_mapping.js", function (req, res) {
    
    var str = " var nodulus_mapping =";
    new ModuleUtiliity().list(function (data) {
        var mapping_result = {};
        for (var x in data) {
            mapping_result[x] = { dependencies: [], scripts: [] };
            if (data[x].scripts) {
                for (var sc = 0; sc < data[x].scripts.length; sc++) {
                    mapping_result[x].scripts.push(data[x].scripts[sc]);
                }
            }
            if (data[x].dependencies) {
                for (var dp = 0; dp < data[x].dependencies.length; dp++) {
                    mapping_result[x].dependencies.push(data[x].dependencies[dp]);
                }
            }
        }
        
        res.type("application/javascript").send(str + JSON.stringify(mapping_result));
    
    })
})
router.post("/pack", function (req, res) {
    
    new ModuleUtiliity().pack(req.body.name, function (data) {
        
        res.json(data);
    
    })
});
router.post('/install', function (req, res) {
if (!req.body)
return res.sendStatus(400);

var module_name = req.body.name;

if (module_name === "" || module_name === undefined)
return res.sendStatus(400);

    new ModuleUtiliity().install(module_name, function (err, manifest_json) {
if (err !== null)
return res.sendStatus(400);


res.json(manifest_json);

});






});
router.post('/create', function (req, res) {
if (!req.body)
return res.sendStatus(400);

var module_name = req.body.name;

if (module_name === "" || module_name === undefined)
return res.sendStatus(400);
    new ModuleUtiliity().validateModuleName(module_name, function (exists) {
if (exists)
return res.json({ "Error": "module name exists" });

        new ModuleUtiliity().createPackage(module_name, function (err, manifest_json) {
if (err !== null)
return res.sendStatus(400);


res.json(manifest_json);

})
})







});
router.post('/uninstall', function (req, res) {
if (!req.body) return res.sendStatus(400);

var module_name = req.body.name;

    new ModuleUtiliity().uninstall(module_name, function (err, result) {

res.json({ "status": "ok" });

});
});


module.exports = router;



