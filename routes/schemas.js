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
var fs = require('fs');
var path = require('path');
var dal = require("../classes/dal.js");
var api = require("../classes/api.js");
var moment = require('moment');
router.get('/collections', function (req, res) {  
    dal.connect(function (err, db) {
          db.listCollections().toArray(function (err, names) {
            names.sort(function (a, b) {
            if (a.name < b.name) return 1;
            if (b.name < a.name) return -1;
            return 0;
        });

            res.json(names);
        });        
    });    
});
module.exports = router;



