var express = require('express');
var http = require('http');
var querystring = require('querystring');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("../classes/dal.js");
var api = require("../classes/api.js");
var moment = require('moment');


router.get('/languages', function (req, res) {

    var lang = req.query.lang;
    dal.connect(function (err, db) {

        db.collection("Languages").find({"name": lang}).limit(1).next(function (err, data) {
            var result = {}
            if (data !== null)
                for (var i = 0; i < data.values.length; i++) {
                    result[data.values[i].Key] = data.values[i].Value;
                }
            return res.json(result);
        });


    });


});


module.exports = router;



