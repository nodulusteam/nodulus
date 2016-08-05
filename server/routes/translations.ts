/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
  
/// <reference path="../typings/main.d.ts" />
 

var express = require('express');
var http = require('http');
var querystring = require('querystring');
var router = express.Router(); 
var util = require('util'); 
var fs = require('fs');
var path = require('path');
 
var api = require("../app/api.js");
var moment = require('moment');

import {dal} from "../app/dal";


router.get('/languages', function (req: any, res: any) {

    var lang = req.query.lang;
    
    dal.connect(function (err: any, db: any) {

        if (db === null) {
            return res.json(err);

        }

        db.collection("Languages").find({ "name": lang }).toArray(function (err: any, data: any) {
            var result: any = {}
            if (data !== null && data.length > 0) {
                data = data[0]
                for (var i = 0; i < data.values.length; i++) {
                    result[data.values[i].Key] = data.values[i].Value;
                }

            }
                
            return res.json(result);
        });


    });


});


module.exports = router;



