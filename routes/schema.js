
var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("../classes/dal.js");
var api = require("../classes/api.js");
var moment = require('moment');


router.get('/collections', function (req, res) {
    
     
    
   
    dal.connect(function (err, db) {
        var names = db.listCollections().toArray(function (err, names) { 
            res.json(names);
        });        
    });    
});



//app.get('/directives', function (req, res) {
//    getDirectiveList(function (files) {
//        for (var i = 0; i < files.length; i++) {
//            //files[i] = files[i].replace('.html', "");
//            var type = files[i].replace('.html', "");
//            var obj = { id: type , name: type };
//            files[i] = obj;
//        }
//        res.json(files);
//    });
//});




module.exports = router;



