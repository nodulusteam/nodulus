/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  /// <reference path="../typings/main.d.ts" />

 

var express = require("@nodulus/core");
var router = express.Router();
var util = require('util');
var fs = require('fs');
var path = require('path');
var dal = require("../app/dal.js");
var api = require("../app/api.js");
var moment = require('moment');
 
 
var usermanager = require("../app/users").users;

 


router.post('/login', function (req: any, res: any) {
    if (!req.body) return res.sendStatus(400);
    
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    
    usermanager.login(email, password, function (user: any) {
        
        
        res.json(user);
        
         
    });
    
     
 
});

router.post('/logout', function (req: any, res: any) {
    if (!req.body) return res.sendStatus(400);
    
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    
    //user.login(email, password, function (user) {
        
        
    //    res.json(user);
        
         
    //});
});


router.post('/register', function (req: any, res: any) {
    if (!req.body) return res.sendStatus(400);
    
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    
    usermanager.register(req.body, function (user: any) {
        
        
        res.json(user);
        
         
    });
    
     
 
});





module.exports = router;



