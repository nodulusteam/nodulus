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
var wildcard = require('wildcard');

var dal = require("../classes/dal.js");
var fs = require("fs-extra");
var JSZip = require("jszip");


/**
 * zip files route
 */
router.get("/zipit", function (req, res) {
    var path = req.query.path;
    var exclude = req.query.exclude;
    var date = new Date(req.query.date);
    var oitems = [];
    var zip = new JSZip();
    var filesArr = [];
    var excludearr = exclude.split("\n");

    zipLevel(path, "", date, excludearr, zip);
    var content = zip.generate({ type: "nodebuffer" });
    var packageFileName = path + "zipem" + ".zip";
    fs.writeFile(packageFileName, content, function (err) {
        if (err)
            throw err;
        // global["socket"].emit("jkhjhkjhkj", packageFileName);
        res.send({ filename: packageFileName });
    });
});



/**
 * show relevant files after date and exclude filter
 */
router.get("/folderpath", function (req, res) {
    var path = req.query.path;
    var date = new Date(req.query.date);
    var oitems = [];
    fs.readdir(path, function (err, items) {
        for (var i = 0; i < items.length; i++) {
            var file = path + '/' + items[i];
           
            var stats = fs.statSync(file);
            if (stats.mtime > date)
                oitems.push({ name: items[i], size: stats.size, mtime: stats.mtime });
        }
        
        res.json(oitems);
    });
});


/**
 * autocomplete for folder selection
 */
router.get("/getFolders", function (req, res) {
    var path = req.query.term;
    var oitems = [];
    var namefilter = "";

    try {
        fs.statSync(path);
    }
    catch (e) {
        namefilter = path.substring(path.lastIndexOf("\\"));
        path = path.substring(0, path.lastIndexOf("\\"));
    }
    fs.readdir(path, function (err, items) {
        if (err !== null) {
            //try folder search
            return res.json([]);
        }
        if(path.lastIndexOf("\\") == path.length)
            path = path.substring(0, path.lastIndexOf("\\"));

        for (var i = 0; i < items.length; i++) {
            var file = path + '\\' + items[i];
            try {
                var stats = fs.statSync(file);
                if (stats.isDirectory()) {
                    if (namefilter !== "") {
                        if (file.toLocaleLowerCase().indexOf(namefilter) > -1)
                            oitems.push({ name: file });
                    }
                    else {
                        oitems.push({ name: file });
                    }
                }
            }
            catch (e) {
            }
        }
        res.json(oitems);
    });
});


function testExclude(excludearr, path) {
    if (excludearr.length == 0 || excludearr[0] === "")
        return false;

    for (var i = 0; i < excludearr.length; i++) {
        if (wildcard(excludearr[i]), path)
            return true;
    }

    return false;

}

function zipLevel(basepath, path, date, excludearr, zip) {
    var cleanPath = path;
    if (path.indexOf("/") == 0)
        cleanPath = path.substring(1);


    var items = fs.readdirSync(basepath + path);
    for (var i = 0; i < items.length; i++) {
        var file = basepath + path + '/' + items[i];



        var stats = fs.statSync(file);
        if (!testExclude(excludearr, file)) {
            
            if (stats.mtime > date && stats.isFile()) {
                if (path === "") {
                    var fileContent = fs.readFileSync(file, "utf-8");
                    zip.file(items[i], fileContent);
                }
                else {
                    var fileContent = fs.readFileSync(file, "utf-8");
                    zip.folder(cleanPath).file(items[i], fileContent);
                }
            }

        }

        if (stats.isDirectory()) {
            zipLevel(basepath, path + "/" + items[i], date, excludearr,  zip);
        }
    }
}
module.exports = router;
//# sourceMappingURL=zipem.js.map