"use strict";
var express = require('express');
var http = require('http');
var querystring = require('querystring');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var api = require("../app/api.js");
var moment = require('moment');
var dal_1 = require("../app/dal");
router.get('/languages', function (req, res) {
    var lang = req.query.lang;
    dal_1.dal.connect(function (err, db) {
        if (db === null) {
            return res.json(err);
        }
        db.collection("Languages").find({ "name": lang }).toArray(function (err, data) {
            var result = {};
            if (data !== null && data.length > 0) {
                data = data[0];
                for (var i = 0; i < data.values.length; i++) {
                    result[data.values[i].Key] = data.values[i].Value;
                }
            }
            return res.json(result);
        });
    });
});
module.exports = router;
