/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
  
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require("fs-extra");
var path = require('path');
var stripBom = require('strip-bom');
var config = require('../classes/config.js');



router.get("/openfile", function (req, res) {
    var file_path = req.query.file_path;//+ req.query.path;
    res.json({ 'path': file_path, 'content': stripBom(fs.readFileSync(file_path, 'utf8')) });


});


router.post("/savefile", function (req, res) {
    var path = req.body.path;//+ req.query.path;
    var content = req.body.content;//+ req.query.path;
    fs.writeFileSync(path, content, 'utf8');
    res.json({ 'path': path, 'content': fs.readFileSync(path, 'utf8') });


});



router.get("/folders", function (req, res) {
    
    var relative_path = req.query.path;
    var parent_path = global.appRoot + relative_path;
    
    
    try {
        fs.statSync(parent_path);
    }
     catch (e) {
        namefilter = path.substring(path.lastIndexOf("\\"));
        path = path.substring(0, path.lastIndexOf("\\"));
    }
    fs.readdir(parent_path, function (err, items) {
        if (err !== null) {
            //try folder search
            return res.json([]);
        }
        var oitems = [];
        
        for (var i = 0; i < items.length; i++) {
            var file = parent_path + '\\' + items[i];
            try {
                var stats = fs.statSync(file);
                if (stats.isDirectory()) {
                    
                    
                    oitems.push({
                        "nodetype": "folder",
                        "_id": file,
                        
                        "Name": items[i],
                        "label": items[i],
                        "path": relative_path + "\\" + items[i]
                                                        
                                                        
                    });
                }
                else {
                    oitems.push({
                        "nodetype": "file",
                        "_id": file,
                        
                        "Name": items[i],
                        "label": items[i],
                        "path": relative_path + "\\" + items[i]
                                                        
                                                        
                    });
                }
                  
            }
             catch (e) {
            }
        }
        res.json({ "items": oitems });
    });
    
  
    
});
module.exports = router;



