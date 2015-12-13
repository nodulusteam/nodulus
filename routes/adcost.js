
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


router.post('/oauth_access_token', function (req, res) {
    var facebookCode = req.query.code;
    var accountId = req.query.a;


});

router.get('/auth', function (req, res) {
    //user accesstoken = 
    var facebookCode = req.query.code;
    var accountId = req.query.a;
    
    dal.connect(function (err, db) {
        
        db.collection("adcost_accounts").update({ _id: accountId }, { $set : { facebookCode: facebookCode } }, function (err, doc) {
            db.collection("adcost_accounts").save({ _id: accountId , facebookCode: facebookCode }, function (err, doc) {
                // res.send("<script>window.close()</script>");
                //var FacebookAdsApi = require("facebook-ads-sdk");
                //  var Client = require('node-rest-client').Client;
                
                
                
                var OAuth2 = require('oauth').OAuth2;
                var oauth2 = new OAuth2("203336776670339",
                        "e90f6140e1e04bc08aa01a931dc5f65d",
                       "", "https://www.facebook.com/dialog/oauth",
                   'https://graph.facebook.com/v2.5/oauth/access_token',
                   null);
                
                oauth2.getOAuthAccessToken(facebookCode,{ 'grant_type': 'ads_read' },
                        function (e, access_token, refresh_token, results) {
                    console.log('bearer: ', access_token);
                    
                    oauth2.get("https://graph.facebook.com/v2.5/act_996050550434146/users", access_token, function (err, data , response) {
                        if (err) {
                            console.error(err);
                            res.send("ok");
                      //  res.send(err);
                        } else {
                            var profile = JSON.parse(data);
                            console.log(profile);
                            var profile_img_url = "https://graph.facebook.com/" + profile.id + "/picture";
                        }
                    });

                        //done();
                    });
                
                
            

                ////client.get("https://graph.facebook.com/2.5/act_996050550434146/insights?date_preset=last_7_days&access_token=' + facebookCode", function (data, response) {
                ////    // parsed response body as js object 
                ////    console.log(data);
                ////    // raw response 
                ////    console.log(response);
                ////});
                //curl = require('node-curl');
                //curl('https://graph.facebook.com/2.5/act_996050550434146/insights?date_preset=last_7_days&access_token=' + facebookCode, function (err) { 
                
                //    var ff = 1;
                //});
 

                //var api = new FacebookAdsApi(facebookCode);
                
                //var FacebookAds = require('dk-machinepack-facebookads');
                //var myAdAccount = new api.AdAccount('act_996050550434146');

                
               
                                    
                                    

                //var postData = querystring.stringify({
                //    'client_id' : '203336776670339',
                //    'redirect_uri': 'index.html',
                //    client_secret: 'e90f6140e1e04bc08aa01a931dc5f65d',
                //    code: facebookCode
                //});

                //var options = {
                //    hostname: 'graph.facebook.com',
                //    port: 443,
                //    path: '/v2.5/oauth/access_token',
                //    method: 'GET',
                //    headers: {
                //        'Content-Type': 'application/x-www-form-urlencoded',
                //        'Content-Length': postData.length
                //    }
                //};
                
                
                //var req = http.request(options, function (res) {
                //    console.log('STATUS: ' + res.statusCode);
                //    console.log('HEADERS: ' + JSON.stringify(res.headers));
                //    res.setEncoding('utf8');
                //    res.on('data', function (chunk) {
                //        console.log('BODY: ' + chunk);
                //    });
                //    res.on('end', function () {
                //        console.log('No more data in response.')
                //    })
                //});
                
                //req.on('error', function (e) {
                //    console.log('problem with request: ' + e.message);
                //});
                
               
                
                // write data to request body
                //req.write(postData);
               // req.end();

                   
            })
            
            if (doc.result.n == 0) {
               
            }
            else {
                res.send("<script>window.close()</script>");
            }
            
        })
    
    });
    
    

});



router.get('/test', function (req, res) {
    var FacebookAds = require('dk-machinepack-facebookads');
    
    
    FacebookAds.getCampaignOverview({
        adCampaignGroupId: '736272126439205',
        accessToken: 'CAACEdEose0cBACBhZA7DJbYapwM7oZBt1EWhPiGqibBZAZAZCZCe6IOkfDRzrs1jyZCS93zSuj9GaNQQtxbny0jeSCqyBNaQUl3ocDiD3lO4GSboFm5B7NogSHFzTGYw0rdpndDKolQcfsS5nYeYwZAIKXF1WPzgGaGxNIDh36oZBHuazcN3WSNmL9jGyO9YmYlZBmZCcigBuMFvtXj4XlzNWyb',
    }).exec({
        // An unexpected error occurred.
        error: function (err) {
 
        },
        // when there are no campaigns yet in the campaign group
        noCampaignsYet: function (result) {
 
        },
        // OK.
        success: function (result) {
 
        },
    });

})
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



