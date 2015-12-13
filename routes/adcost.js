
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



//function _login(email, password, callback) {

//    var query = "SELECT * FROM users WHERE email=@email AND password=@password;";
//    dal.query(query, { "email": email, "password": password }, function (user) {

//        if (user.length == 0) {

//            user = { error: { message: "not found" } };
//            callback(user);
//        }
//        else {
//            callback(user[0]);
//        }





//    });





//}
//function _register(user, callback) {    
//    var query = "SELECT * FROM users WHERE email=@email;";
//    dal.query(query, { "email": user.Email }, function (exuser) {
//        if (exuser.length == 0) {


//            var query = "INSERT INTO users email=@email,password=@password;";
//            dal.query(query, { "email": user.Email , "password": user.Password }, function (user) {

//                callback(user.ops[0]);

//            });




//        }
//        else {
//            user = { error: { message: "user exists" } };
//            callback(user);
//        }





//    });





//}


//router.get('/login', function (req, res) {
//    if (!req.body) return res.sendStatus(400);

//    // Convert our form input into JSON ready to store in Couchbase
//    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
//    var email = req.body.Email;
//    var password = req.body.Password;

//    _login(email, password, function (user) {


//        res.json(user);


//    });



//});
router.get('/auth', function (req, res) {
    //user accesstoken = 
    var facebookCode = req.query.code;
    var accountId = req.query.a;
    
    dal.connect(function (err, db) {
        
        db.collection("adcost_accounts").update({ _id: accountId }, { $set : { facebookCode: facebookCode } }, function (err, doc) {
            db.collection("adcost_accounts").save({ _id: accountId , facebookCode: facebookCode }, function (err, doc) {
               // res.send("<script>window.close()</script>");
                
                
                var postData = querystring.stringify({
                    'client_id' : '1053239254694437',
                    'redirect_uri': 'index.html',
                    client_secret: '963fe463993fd6291a862766e5df89bc',
                    code: facebookCode
                });

                var options = {
                    hostname: 'graph.facebook.com',
                    port: 443,
                    path: '/v2.5/oauth/access_token',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length
                    }
                };
                
                
                var req = http.request(options, function (res) {
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                    });
                    res.on('end', function () {
                        console.log('No more data in response.')
                    })
                });
                
                req.on('error', function (e) {
                    console.log('problem with request: ' + e.message);
                });
                
               
                
                // write data to request body
                req.write(postData);
                req.end();

                   
            })

            if (doc.result.n == 0) {
               
            }
            else {
                res.send("<script>window.close()</script>");
            }
            
        })
    
    });
    
    

});

//router.post('/logout', function (req, res) {
//    if (!req.body) return res.sendStatus(400);

//    // Convert our form input into JSON ready to store in Couchbase
//    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
//    var email = req.body.Email;
//    var password = req.body.Password;

//    //user.login(email, password, function (user) {


//    //    res.json(user);


//    //});
//});


//router.post('/register', function (req, res) {
//    if (!req.body) return res.sendStatus(400);

//    // Convert our form input into JSON ready to store in Couchbase
//    var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
//    var email = req.body.Email;
//    var password = req.body.Password;

//    _register(req.body, function (user) {


//        res.json(user);


//    });



//});





module.exports = router;



