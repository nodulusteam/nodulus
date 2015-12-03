var _api = (function () {
    
    var config = require('./config.js');
    var dal = require('./dal.js');
    var util = require('util');
    var fs = require('fs');
    var path = require('path');
    var express = require('express');
    
    
    
    function _start(app) {
        var router = express.Router();
        router.route('/*')
        .get(function (req, res) {
            var entity = req.params[0];
            
            var where = "";
            var whereObj = {};
            var and = " AND ";
            if (req.query != null) {
                where = " WHERE ";
                for (var key in req.query) {
                    where += key + "=@" + key + and;
                    
                    whereObj[key] = req.query[key];
                }
                
                where = where.substring(0, where.length - and.length);
                if (where == " WHERE ")
                    where = "";
            }
            var query = "SELECT * FROM " + entity + where + ";";
            dal.query(query, whereObj, function (result) {
                
                var data = { items: result }
                res.end(JSON.stringify(data));
            });

        })
        .post(function (req, res) {
            if (!req.body) return res.sendStatus(400);
            var entity = req.params[0];
            var and = ",";
            
            var query = "INSERT INTO "+ entity +" ";
            
            if (req.body != null) {                
                for (var key in req.body) {
                    query += key + "=@" + key + and;                   
                }               
            }
            dal.query(query, req.body, function (apiResult) { 
                var data = { items: apiResult.ops }
                res.end(JSON.stringify(data));       
            }); 

        }).put(function (req, res) {
            if (!req.body) return res.sendStatus(400);
            var entity = req.params[0];
            var and = ",";
            
            var query = "UPDATE " + entity + " SET ";
            
            if (req.body != null) {
                for (var key in req.body) {
                    if(key!== "")
                    query += key + "=@" + key + and;
                }
            }
            dal.query(query, req.body, function (apiResult) {
                var data = { items: apiResult.ops }
                res.end(JSON.stringify(data));
            });

        }).delete(function (req, res) {
            if (!req.body) return res.sendStatus(400);
            var entity = req.params[0];
            var and = " AND ";
            
            var query = "DELETE FROM " + entity + " WHERE ";
            
            if (req.query != null) {
                for (var key in req.query) {
                    if (key !== "")
                        query += key + "=@" + key + and;
                }
            }
            dal.query(query, req.query, function (apiResult) {
                var data = { items: apiResult.ops }
                res.end(JSON.stringify(data));
            });

        });
        
        
        
        app.use('/api', router);

        //app.get('/api/*', function (req, res) {
            
        //    var entity = req.params[0].substring(1);
        //    var where = "";
        //    var whereObj = {};
        //    var and = " AND ";
        //    if (req.query != null) {
        //        where = " WHERE ";
        //        for (var key in req.query) {
        //            where += key + "=@" + key + and;
                    
        //            whereObj[key] = req.query[key];
        //        }
                
        //        where = where.substring(0, where.length - and.length);
        //    }
        //    var query = "SELECT * FROM " + entity + where + ";";
        //    dal.query(query, whereObj, function (result) {
                
        //        res.end(JSON.stringify(result));
        //    });

            

           
            
            
    
     
 
        //});
        
        //app.post('/api/*', function (req, res) {
        //    if (!req.body) return res.sendStatus(400);
            
        //    //// Convert our form input into JSON ready to store in Couchbase
        //    //var jsonVersion = "{}";//returnJSONResults("", "");//JSON.stringify(req.body);
        //    //var email = req.body.Email;
        //    //var password = req.body.Password;
            
            
    
     
 
        //});
        
 


        //app.put('/api/*', function (req, res) {         
        //    if (!req.body) return res.sendStatus(400);            
        //    var entity = req.params[0].substring(1);
        //    var query = "INSERT INTO "+ entity +" ";
            
        //    if (req.body != null) {                
        //        for (var key in req.body) {
        //            query += key + "=@" + key + and;                   
        //        }               
        //    }
        //    dal.query(query, req.body, function (user) {            
        //    }); 
        //});
    }
    return {
        start: _start
    };
})();
// node.js module export
module.exports = _api;