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
var usermanager = require("../classes/users").users;
router.post('/login', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}"; //returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    usermanager.login(email, password, function (user) {
        res.json(user);
    });
});
router.post('/logout', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}"; //returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    //user.login(email, password, function (user) {
    //    res.json(user);
    //});
});
router.post('/register', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}"; //returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    usermanager.register(req.body, function (user) {
        res.json(user);
    });
});
module.exports = router;
//# sourceMappingURL=users.js.map