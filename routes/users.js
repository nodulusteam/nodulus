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
 


function _login(email, password, callback) {
    
    var query = "SELECT * FROM users WHERE email=@email AND password=@password;";
    dal.query(query, { "email": email, "password": password }, function (user) {
        
        if (user.length == 0) {
            
            user = { error: { message: "not found" } };
            callback(user);
        }
        else {
            callback(user[0]);
        }
            
                
            


    });

        
        

        
}
function _register(user, callback) {    
    var query = "SELECT * FROM users WHERE email=@email;";
    dal.query(query, { "email": user.Email }, function (exuser) {
        if (exuser.length == 0) {
            
            
            var query = "INSERT INTO users email=@email,password=@password;";
            dal.query(query, { "email": user.Email , "password": user.Password }, function (user) {
                
                callback(user.result.upserted[0]);
                
            });
                    
                    

              
        }
        else {
            user = { error: { message: "user exists" } };
            callback(user);
        }
            
           
            


    });

        
        

        
}


router.post('/login', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    
    _login(email, password, function (user) {
        
        
        res.json(user);
        
         
    });
    
     
 
});

router.post('/logout', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    
    //user.login(email, password, function (user) {
        
        
    //    res.json(user);
        
         
    //});
});


router.post('/register', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    
    // Convert our form input into JSON ready to store in Couchbase
    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
    var email = req.body.Email;
    var password = req.body.Password;
    
    _register(req.body, function (user) {
        
        
        res.json(user);
        
         
    });
    
     
 
});





module.exports = router;



