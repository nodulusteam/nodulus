
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("../classes/dal.js");
var api = require("../classes/api.js");
var moduleUtiliity = require("../classes/module_installer.js");
var moment = require('moment');



router.get("/list", function (req, res) {
    
    moduleUtiliity.list(function (data) {
        var arr = [];
        for (var x in data) {
            arr.push(data[x]);
        }
        
        res.json(arr);
    
    })
})
router.get("/nodulus_mapping.js", function (req, res) {
    
    var str =" var nodulus_mapping =";
    moduleUtiliity.list(function (data) {
        var mapping_result = {};
        for (var x in data) {
            mapping_result[x] = {dependencies: [],scripts: [] };
            if(data[x].scripts){
            for(var sc=0;sc < data[x].scripts.length; sc++)
            {
                mapping_result[x].scripts.push(data[x].scripts[sc]);
            }
            }
            if(data[x].dependencies)
            {
             for(var dp=0;dp < data[x].dependencies.length; dp++)
            {
                mapping_result[x].dependencies.push(data[x].dependencies[dp]);
            }
            }
        }
        
        res.type("application/javascript").send(str  +  JSON.stringify(mapping_result));
    
    })
})




router.post("/pack", function (req, res) {
    
    moduleUtiliity.pack(req.body.name, function (data) {
        
        res.json(data);
    
    })
})



router.post('/install', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    
    var module_name = req.body.name;
    
    if (module_name === "" || module_name === undefined)
        return res.sendStatus(400);
    
    moduleUtiliity.install(module_name, function (err, manifest_json) {
        if (err !== null)
            return res.sendStatus(400);
        
        
        res.json(manifest_json);
    
    });
     
    
     
    
     
 
});

router.post('/uninstall', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    
    var module_name = req.body.name;
    
    moduleUtiliity.uninstall(module_name, function (err, result) {
        
        res.json({ "status": "ok" });

    });
});








module.exports = router;



