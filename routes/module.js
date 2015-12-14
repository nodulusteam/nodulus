
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



