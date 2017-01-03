var core = require("@nodulus/core");
var router = core.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("../app/dal.js");
var api = require("../app/api.js");
var moment = require('moment');
var usermanager = require("../app/users").users;
router.post('/login', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var jsonVersion = "{}";
    var email = req.body.Email;
    var password = req.body.Password;
    usermanager.login(email, password, function (user) {
        res.json(user);
    });
});
router.post('/logout', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var jsonVersion = "{}";
    var email = req.body.Email;
    var password = req.body.Password;
});
router.post('/register', function (req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var jsonVersion = "{}";
    var email = req.body.Email;
    var password = req.body.Password;
    usermanager.register(req.body, function (user) {
        res.json(user);
    });
});
module.exports = router;
//# sourceMappingURL=users.js.map