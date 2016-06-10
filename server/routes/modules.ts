/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
/// <reference path="../typings/main.d.ts" />



import {consts} from "../app/consts";
import {dal} from "../app/dal";


var express = require('express');
var app = express();

var router = express.Router();
var util = require('util');
var path = require('path');

var fs = require("fs-extra");
var JSZip = require("jszip");
var moment = require('moment');
var mkdirp = require('mkdirp');


var appRoot = global.appRoot;
var serverRoot = global.serverAppRoot;

var modules_configuration_path = global.serverAppRoot + consts.MODULES_NAME;

var deleteFolderRecursive = (folderpath: string) => {
    if (fs.existsSync(folderpath)) {
        fs.readdirSync(folderpath).forEach((file: string, index: number) => {
            var curPath = path.join(folderpath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}


class ModuleUtiliity {

    constructor() {

    }
    /**
     * install the module package
     * @param module_name
     * @param callback
     */
    install(module_name: string, callback: Function) {
        var instance = this;

        var baseFolder = appRoot + consts.MODULES_PATH + module_name;

        global.debug("module path:", baseFolder + module_name + ".zip");

        fs.ensureDirSync(global.clientAppRoot + "modules");
        fs.ensureDirSync(baseFolder);

        // read a zip file
        fs.readFile(path.join(global.nodulsRepo, module_name + ".zip"), (err: any, data: any) => {
            if (err) throw err;

            var zip = new JSZip(data);
            var fileData = zip.file(consts.MANIFEST_NAME).asText();
            fs.writeFileSync(path.join(baseFolder, consts.MANIFEST_NAME), fileData, 'utf8');
            var manifest_file = fs.readJsonSync(path.join(baseFolder, consts.MANIFEST_NAME), { throws: true });


            if (manifest_file.files !== undefined) {
                for (var i = 0; i < manifest_file.files.length; i++) {
                    var filename = manifest_file.files[i];
                    if (zip.file(filename)) {
                        var fileData = zip.file(filename).asText();

                        if (filename.indexOf('/') > -1) {
                            var directoryPath = (path.join(baseFolder, filename.replace(/\//g, '\\')));
                            directoryPath = directoryPath.substr(0, directoryPath.lastIndexOf('\\'));
                            if (!fs.existsSync(directoryPath))
                                mkdirp.sync(directoryPath);
                        }



                        fs.writeFileSync(path.join(baseFolder, filename), fileData, 'utf8');
                    }

                }
            }

            if (manifest_file.routes !== undefined) {
                for (var i = 0; i < manifest_file.routes.length; i++) {
                    var filename = manifest_file.routes[i].path;
                    if (zip.folder("routes").file(filename)) {
                        var fileData = zip.folder("routes").file(filename).asText();
                        fs.writeFileSync(path.join(serverRoot, "routes", filename), fileData, 'utf8');
                    }
                    //attach the new route to express
                    app.use(module_name, require('../routes/' + filename));
                }
            }

            if (manifest_file.scripts !== undefined) {
                fs.ensureDirSync(path.join(baseFolder, "scripts"));
                for (var i = 0; i < manifest_file.scripts.length; i++) {
                    var filename = manifest_file.scripts[i];
                    if (zip.folder("scripts").file(filename)) {
                        var fileData = zip.folder("scripts").file(filename).asText();
                        fs.writeFileSync(path.join(baseFolder, "scripts", filename), fileData, 'utf8');
                    }

                }
            }


            var aboutfilename = "about.html";
            if (zip.file(aboutfilename) !== null) {
                var fileData = zip.file(aboutfilename).asText();
                fs.writeFileSync(path.join(baseFolder, aboutfilename), fileData, 'utf8');
            }






            //register the module to the modules.json file
            fs.ensureFileSync(modules_configuration_path);
            var modules_file: any = {};

            modules_file = fs.readJsonSync(modules_configuration_path);

            if (modules_file[module_name] === undefined) {
                modules_file[module_name] = {}
            }


            //merge the manifest into the modules.json file
            if (manifest_file === null)
                callback("invalid json, try using ascii file");

            //update navigation
            if (manifest_file.navigation)
                dal.connect((err: any, db: any) => {

                    for (var i = 0; i < manifest_file.navigation.length; i++) {
                        db.collection("Navigation").save(manifest_file.navigation[i], (err: any, data: any) => {

                        });
                    }
                })


            modules_file[module_name] = manifest_file;

            if (manifest_file.npm !== undefined) {
                var arr: Array<any> = [];
                for (var x in manifest_file.npm) {
                    arr.push({ name: x, ver: manifest_file.npm[x] });
                }
                //install npm dependencies
                var async = require("async");
                async.each(arr, instance.npm_install, () => {
                    fs.writeFileSync(modules_configuration_path, JSON.stringify(modules_file));
                    callback(null, manifest_file);
                })
            }
            else {
                fs.writeFileSync(modules_configuration_path, JSON.stringify(modules_file));
                callback(null, manifest_file);
            }
        });
    }
    /**
     * uninstall the module package
     * @param module_name
     * @param callback
     */
    uninstall(module_name: string, callback: Function) {
        var modules_file = fs.readJsonSync(modules_configuration_path);
        if (modules_file[module_name] && modules_file[module_name].routes) {
            for (var i = 0; i < modules_file[module_name].routes.length; i++) {
                try {
                    fs.unlinkSync(path.join(serverRoot, "routes", modules_file[module_name].routes[i].path));
                } catch (e) { }
            }
        }
        try {

            try {
                var manifest_file = fs.readJsonSync(path.join(global.clientAppRoot, "modules", module_name, consts.MANIFEST_NAME), { throws: false });
                //merge the manifest into the modules.json file
                if (manifest_file === null)
                    callback("invalid json, try using ascii file");
                dal.connect((err: any, db: any) => {
                    if (manifest_file.navigation) {
                        for (var i = 0; i < manifest_file.navigation.length; i++) {
                            db.collection("Navigation").remove({ "_id": manifest_file.navigation[i]._id }, (err: any, data: any) => { });
                        }
                    }
                });
            } catch (e) {
                //no manifest file continue clean up...
            }
            //delete module folder
            this.deleteFolderRecursive(path.join(global.clientAppRoot, "modules", module_name));
            delete modules_file[module_name];
            fs.writeFileSync(modules_configuration_path, JSON.stringify(modules_file));
            callback("ok");
        }
        catch (e) {
            callback(e);
        }
    }



    timestamp(): string {
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
    npm_install(packagePair: any, callback: Function) {
        var exec = require('child_process').exec,
            child: any;

        child = exec('npm install ' + packagePair.name + ' --save',
            function (error: any, stdout: any, stderr: any) {

                callback(stderr, stdout);
                //console.log('stdout: ' + stdout);
                //console.log('stderr: ' + stderr);
                //if (error !== null) {
                //    console.log('exec error: ' + error);
                //}
            });
    };
    replaceAll(replaceThis: string, withThis: string, inThis: string) {
        withThis = withThis.replace(/\$/g, "$$$$");
        return inThis.replace(new RegExp(replaceThis.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g, "\\$&"), "g"), withThis);
    };
    deleteFolderRecursive(folderpath: string) {
        if (fs.existsSync(folderpath)) {
            fs.readdirSync(folderpath).forEach((file: string, index: number) => {
                var curPath = path.join(folderpath, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(folderpath);

        }
    };
    list(callback: Function) {



        fs.readJson(modules_configuration_path, (err: any, data: any) => {

            callback(data);


        });

    }
    validateModuleName(module_name: string, callback: Function) {

        if (fs.existsSync(path.join(global.nodulsRepo, module_name + ".zip"))) {
            return callback(true);
        }
        return callback(false);
    }
    createPackage(module_name: string, callback: Function) {
        var baseFolder = path.join(global.clientAppRoot, "modules", "modules", "template");
        var manifest_file = fs.readJsonSync(path.join(baseFolder, consts.MANIFEST_NAME), { throws: false });

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
        var filesArr: Array<any> = [];

        var fileContent = fs.readFileSync(path.join(baseFolder, "template.js"), "utf-8");
        fileContent = this.replaceAll("$$module_name$$", module_name, fileContent);
        zip.file(module_name + ".js", fileContent);

        var fileContent = fs.readFileSync(path.join(baseFolder, "template.html"), "utf-8");
        fileContent = this.replaceAll("$$module_name$$", module_name, fileContent);
        zip.file(module_name + ".html", fileContent);

        zip.file(consts.MANIFEST_NAME, JSON.stringify(manifest_file));




        var fileContent = fs.readFileSync(path.join(baseFolder, "about.html"), "utf-8");
        fileContent = this.replaceAll("$$module_name$$", module_name, fileContent);
        zip.file("about.html", fileContent);



        var fileContent = fs.readFileSync(path.join(baseFolder, "routes", "template.js"));
        zip.folder("routes").file(module_name + ".js", fileContent);


        //get manifest template:
        var content = zip.generate({ type: "nodebuffer" });
        var packageFileName = path.join(global.nodulsRepo,  module_name + ".zip");
        var packageBackupFileName = path.join( global.nodulsRepo , module_name ,  module_name + "." + this.timestamp() + ".zip");


        if (!fs.existsSync(global.nodulsRepo)) {
            fs.ensureDirSync(global.nodulsRepo);
        }



        if (fs.existsSync(packageFileName)) {
            fs.ensureDirSync(path.join(global.nodulsRepo , module_name));
            fs.renameSync(packageFileName, packageBackupFileName);
        }


        //var oldPackage  = fs.readFileSync(global.appRoot + "/nodulus_modules/" + module_name + ".zip");

        // see FileSaver.js
        fs.writeFile(packageFileName, content, (err: any) => {
            if (err) throw err;
            callback(null, manifest_file);
        });
    }
    pack(module_name: string, callback: Function) {
        var baseFolder = path.join( global.clientAppRoot , "modules" , module_name );
        var manifest_file = fs.readJsonSync(path.join(baseFolder , consts.MANIFEST_NAME), { throws: false });
        //merge the manifest into the modules.json file
        if (manifest_file === null)
            callback("invalid json, try using ascii file");


        var zip = new JSZip();
        var filesArr: Array<any> = [];
        for (var i = 0; i < manifest_file.files.length; i++) {
            if (fs.existsSync(path.join(baseFolder , manifest_file.files[i]))) {
                var fileContent = fs.readFileSync(path.join(baseFolder , manifest_file.files[i]));
                zip.file(manifest_file.files[i], fileContent);


            }


        }

        if (manifest_file.routes !== undefined) {
            var routeBase: string = path.join(serverRoot   , "routes");
            for (var i = 0; i < manifest_file.routes.length; i++) {
                if (fs.existsSync(path.join(routeBase , manifest_file.routes[i].path))) {
                    var fileContent = fs.readFileSync(path.join(routeBase , manifest_file.routes[i].path));
                    zip.folder("routes").file(manifest_file.routes[i].path, fileContent);
                }

                var tsfile = routeBase + manifest_file.routes[i].path.replace('.js', '.ts');
                if (fs.existsSync(tsfile)) {
                    var fileContent = fs.readFileSync(tsfile);
                    zip.folder("routes").file(manifest_file.routes[i].path.replace('.js', '.ts'), fileContent);
                }


            }
        }


        if (manifest_file.scripts !== undefined) {
            for (var i = 0; i < manifest_file.scripts.length; i++) {
                if (fs.existsSync(path.join(baseFolder , "scripts",  manifest_file.scripts[i]))) {
                    var fileContent = fs.readFileSync(path.join(baseFolder , "scripts", manifest_file.scripts[i]));
                    zip.folder("scripts").file(manifest_file.scripts[i], fileContent);
                }
            }
        }





        if (fs.existsSync(baseFolder + "about.html")) {
            var fileContent = fs.readFileSync(path.join(baseFolder , "about.html"));
            zip.file("about.html", fileContent);
        }




        var manifestContent = fs.readFileSync(path.join(baseFolder , consts.MANIFEST_NAME));
        zip.file(consts.MANIFEST_NAME, manifestContent);


        var content = zip.generate({ type: "nodebuffer" });
        var packageFileName = path.join( global.nodulsRepo , module_name + ".zip");
        var packageBackupFileName = path.join(global.nodulsRepo , module_name , module_name + "." + this.timestamp() + ".zip");

        if (fs.existsSync(packageFileName)) {
            fs.ensureDirSync(path.join(global.nodulsRepo , module_name));
            fs.renameSync(packageFileName, packageBackupFileName);
        }


        //var oldPackage  = fs.readFileSync(global.appRoot + "/nodulus_modules/" + module_name + ".zip");

        // see FileSaver.js
        fs.writeFile(packageFileName, content, (err: any) => {
            if (err) throw err;
            callback(null, manifest_file);
        });



    }




};

router.get("/listsearch", (req: any, res: any) => {
    //var glob = require("glob")

    fs.readdir(global.nodulsRepo, (err: any, files: Array<string>) => {
        var arrRes: Array<any> = [];
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
router.get("/navigation", (req: any, res: any) => {

    new ModuleUtiliity().list((data: any) => {
        var arr: Array<any> = [];
        for (var x in data) {
            if (data[x].modules_navigation && data[x].modules_navigation.length > 0)
                arr.push(data[x].modules_navigation[0]);
        }

        res.json(arr);

    })
});
router.get("/list", (req: any, res: any) => {

    new ModuleUtiliity().list((data: any) => {
        var arr: Array<any> = [];
        for (var x in data) {
            arr.push(data[x]);
        }

        res.json(arr);

    })
})
router.get("/listnav", (req: any, res: any) => {

    new ModuleUtiliity().list((data: any) => {
        var arr: Array<any> = [];
        for (var x in data) {
            if (data[x].navname !== undefined)
                arr.push(data[x]);
        }

        res.json(arr);

    })
})

router.get("/nodulus_mapping.js", (req: any, res: any) => {

    var str = " var nodulus_mapping =";
    new ModuleUtiliity().list((data: any) => {
        var mapping_result: any = {};
        for (var x in data) {
            mapping_result[x] = { dependencies: [], scripts: [], styles: [] };
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
            if (data[x].styles) {
                for (var dp = 0; dp < data[x].styles.length; dp++) {
                    mapping_result[x].styles.push(data[x].styles[dp]);
                }
            }
        }

        res.type("application/javascript").send(str + JSON.stringify(mapping_result));

    })
})
router.post("/pack", (req: any, res: any) => {

    new ModuleUtiliity().pack(req.body.name, (data: any) => {

        res.json(data);

    })
});
router.post('/install', (req: any, res: any) => {
    if (!req.body)
        return res.sendStatus(400);

    var module_name = req.body.name;

    if (module_name === "" || module_name === undefined) {
        global.debug("module name is missing");
        return res.sendStatus(400);
    }
    new ModuleUtiliity().install(module_name, (err: any, manifest_json: any) => {
        if (err !== null)
            return res.sendStatus(400);


        res.json(manifest_json);

    });






});
router.post('/create', (req: any, res: any) => {
    if (!req.body)
        return res.sendStatus(400);

    var module_name = req.body.name;

    if (module_name === "" || module_name === undefined)
        return res.sendStatus(400);
    new ModuleUtiliity().validateModuleName(module_name, (exists: boolean) => {
        if (exists)
            return res.json({ "Error": "module name exists" });

        new ModuleUtiliity().createPackage(module_name, (err: any, manifest_json: any) => {
            if (err !== null)
                return res.sendStatus(400);


            res.json(manifest_json);

        })
    })







});
router.post('/uninstall', (req: any, res: any) => {
    if (!req.body) return res.sendStatus(400);

    var module_name = req.body.name;

    new ModuleUtiliity().uninstall(module_name, (err: any, result: boolean) => {

        res.json({ "status": "ok" });

    });
});


module.exports = router;



