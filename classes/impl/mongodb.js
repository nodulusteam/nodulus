var Dal = (function () {
    
    
    var util = require('util');
    var fs = require('fs');
    var path = require('path');
    var config = require('../config.js');
    var ObjectID = require("mongodb").ObjectID;
   
    //var couchbase = require('couchbase');
    
    //fs.readFile('./config/site.json', 'utf8', function (err, data) {
    //    if (err) throw err;
    //    obj = JSON.parse(data);
    //});   
    
    var private_variable = 'value';
    function private_function() {
        return obj;
    }
    
    var assert = require('assert');
    
    function mongoOperator(key) {
        var ops = {
            "=": "$eq",
            "!=": "$ne",
            ">": "$gt",
            ">=": "$gte",
            "<": "$lt",
            ">=": "$lte",
            "in": "$in"

        }
        
        if (ops[key] === undefined)
            return key;
        
        return ops[key];


    }
    
    
    function parse(str, params) {
        var res = { collection: "", where: {}, values: {} }
        
        var x = str.split(" ")
        res.queryMode = x[0].trim();
        
        if (x[2] == "SET") {
            res.values = { "$set": {} }
            var pairs = str.substring(str.indexOf("SET") + 3).split(",");
            for (var j = 0; j < pairs.length; j++) {
                var triple = pairs[j].split("=");
                res.values["$set"][triple[0].trim()] = params[triple[0].trim()];
            }
        }
        
        
        
        
        for (var i = 0; i < x.length; i++) {
            if (x[i] == "UPDATE")
                res.collection = x[i + 1];
            
            
            
            
            
            
            if (x[i] == "FROM")
                res.collection = x[i + 1];
            
            
            if (x[i] == "INTO") {
                
                
                //var actionGuid = require("guid").create().value;
                //res.values["id"] = actionGuid;
                res.collection = x[i + 1];
                res.values = params;
                //var pairs = str.split("INTO " + res.collection)[1].split(",");
                //for (var j = 0; j < pairs.length; j++) {
                //    var triple = pairs[j].split("=");
                //    res.values[triple[0].trim()] = params[triple[0].trim()];


                //}
            }
            if (x[i] == "WHERE") {
                var conditionPoint = res.where;
                if (res.queryMode != "UPDATE") {
                    conditionPoint["$query"] = {};
                    conditionPoint = conditionPoint["$query"];
                }
                
                
                var pairs = str.substring(str.indexOf("WHERE") + 6).split("AND");
                for (var j = 0; j < pairs.length; j++) {
                    var triple = pairs[j].split("@");
                    if (triple.length < 2)
                        continue;
                    
                    var cleankey = triple[1].replace(';', '').trim();
                    
                    
                    if (cleankey === "$limit")
                        res.limit = params[cleankey];
                    
                    var operator = mongoOperator(triple[0].replace(cleankey, '').trim());
                    
                    if (operator !== "^^") {
                        conditionPoint[cleankey] = {};
                        
                        
                        conditionPoint[cleankey][operator] = params[cleankey];
                        
                        if (params[cleankey] == "false")
                            conditionPoint[cleankey][operator] = false;
                        if (params[cleankey] == "true")
                            conditionPoint[cleankey][operator] = true;


                    }
                    else {
                        res.where[cleankey] = params[cleankey];
                    }

                   


                }


            }
        }
        
        
        return res;


    }
    
    
    
    
    function _getAll(callback) {
        var url = config.appSettings().mongodb.host;
        var Db = require('mongodb').Db;
        var Server = require('mongodb').Server;
        
        var db = new Db('scripter', new Server('localhost', 27017));
        // Establish connection to db
        db.open(function (err, db1) {
            assert.equal(null, err);
            // Return the information of a all collections, using the callback format
            db.collections(function (err, items) {
                assert.ok(items.length > 0);
                var fitems = [];
                for (var i = 0; i < items.length; i++) {
                    fitems.push(items[i].s.name);
                }
                callback(fitems);
            });
        });
    }
    
    function _getCollection(name, callback) {
        Dal.query("SELECT * FROM " + name, {}, callback);
    }
    
    function _getSingle(name, id, callback) {
        
        _connect(function (err, db) {
            assert.equal(null, err);
            
            
            
            db.collection(name).findOne({ "_id": ObjectID(id) }, function (err, doc) {
                if (err !== null || doc === null)
                    callback({ "error": "not found" });
                else
                    callback(doc);
            });

           
        });
      
    }
    
    this.db = null;
    function _connect(callback) {
        var url = config.appSettings().mongodb.host;
        var MongoClient = require('mongodb').MongoClient;
        if (Dal.db === undefined) {
            MongoClient.connect(url, function (err, db) {
                
                Dal.db = db;
                callback(err, db);
            });
        } else {
            callback(null, Dal.db);
        }


    }
    
    function _saveSchema(name, schema, callback) {
        Dal.query("INSERT INTO schemas name=@name, schema=@schema" , { "name": name, "schema": schema }, callback);
    }
    
    function _getSchema(name, callback) {
        Dal.query("SELECT * FROM schemas WHERE name=@name" , { "name": name }, callback);
    }
    
    
    function _insertOrUpdate(queryStr, params, callback) {
        
        var oQuery = parse(queryStr, params);
        var url = config.appSettings().mongodb.host;
        var MongoClient = require('mongodb').MongoClient;
        
        collection.insert({ hello: 'world_no_safe' });

    }
    
    function _deleteCollection(collection, id, callback) {
        var url = config.appSettings().mongodb.host;
        var MongoClient = require('mongodb').MongoClient;
        _connect(function (err, db) {
            assert.equal(null, err);
            
            db.collection(collection).findAndRemove({ "id": id }, function (err, doc) {
                assert.equal(null, err);
                
                callback(doc);
            });
        });
    }
    
    
    
    function _addToSet(id, collection, propertyName, pushObject, callback) {
        _connect(function (err, db) {
            assert.equal(null, err);
            
            var pusher = {};
            pusher[propertyName] = pushObject;
            db.collection(collection).update({ _id: id }, { $addToSet: pusher }, function (err, data) {
                
                callback(data);
            });


            
        });



    }
    
    
    function _pushObject(id, collection, propertyName, pushObject, callback) {
        _connect(function (err, db) {
            assert.equal(null, err);
            
            var pusher = {};
            pusher[propertyName] = pushObject;
            db.collection(collection).update({ _id: id }, { $push: pusher }, function (err, data) {
                
                callback(data);
            });


            
        });



    }
    
    function _pullObject(id, collection, propertyName, pullObject, callback) {
        _connect(function (err, db) {
            assert.equal(null, err);
            var puller = {};
            
            puller[propertyName] = pullObject;
            
            db.collection(collection).update({ _id: id }, { $pull: puller }, function (err, data) {
                callback(data);
            });
        });
    }
    
    function _getSet(idArr, collection, callback) {
        
        if (typeof (idArr) == "string")
            idArr = [idArr];
        
        
        _connect(function (err, db) {
            assert.equal(null, err);
            db.collection(collection).find({ _id: { "$in": idArr } }).toArray(function (err, data) {
                callback(data);
            });
        });
    }
    
    
    
    
    function _query(queryStr, params, callback) {
        var oQuery = parse(queryStr, params);
        
        
        
        
        //if (oQuery.where["$query"]["_id"] !== undefined) {
        //    oQuery.where["$query"]["_id"] = { ObjectID(oQuery.where["_id"]);
        //}
        
        
        _connect(function (err, db) {
            assert.equal(null, err);
            
            switch (oQuery.queryMode) {
                case "INSERT":
                    
                    if (oQuery.values["_id"] === undefined)
                        oQuery.values["_id"] = require("guid").create().value;    

                    db.collection(oQuery.collection).save(oQuery.values
                        , function (err, result) {
                        //if (result.result.upserted !== undefined || result.result.nModified == 1) {
                        //    sendToArchive(oQuery, result);
                        //}
                        
                        
                        assert.equal(err, null);
                        console.log("inserted document from " + oQuery.collection);
                        callback(result);
                    });
                    
                    break;
                case "DELETE":
                    db.collection(oQuery.collection).remove(oQuery.where["$query"]
                        , function (err, result) {
                        //if (result.result.ok == 1) {
                        //    sendToArchive(oQuery, result);
                        //}
                        assert.equal(err, null);
                        console.log("deleted document from " + oQuery.collection);
                        callback(result);
                    });
                    
                    break;
                    
                    db.collection(oQuery.collection).remove(oQuery.where
                        , function (err, result) {
                        assert.equal(err, null);
                        console.log("deleted document from " + oQuery.collection);
                        callback(result);
                    });
                    
                    break;
                case "UPDATE":
                    db.collection(oQuery.collection).update(oQuery.where, oQuery.values
                        , function (err, result) {
                        
                        assert.equal(err, null);
                        console.log("updated document from " + oQuery.collection);
                        var cursor = db.collection(oQuery.collection).find(oQuery.where);
                        var retArr = [];
                        cursor.each(function (err, doc) {
                            assert.equal(err, null);
                            if (doc != null) {
                                retArr.push(doc);
                     
                            } else {
                                callback(retArr)
                            }
                        });
                    });
                    
                    break;
                case "SELECT":
                    var retArr = [];
                    var cursor;
                    var whereFlag = false;
                    for (var i in oQuery.where)
                        whereFlag = true;
                    
                    if (whereFlag)
                        cursor = db.collection(oQuery.collection).find(oQuery.where);
                    else
                        cursor = db.collection(oQuery.collection).find();
                    
                    if (oQuery.limit === undefined)
                        oQuery.limit = 0;
                    
                    
                    
                    cursor.limit(oQuery.limit).each(function (err, doc) {
                        assert.equal(err, null);
                        if (doc != null) {
                            retArr.push(doc);
                     
                        } else {
                            callback(retArr)
                        }
                    });
                    break;
            }
        });

    }
    
    function sendToArchive(data, res) {
        
        if (res.result.upserted !== undefined)
            data.docIdentifier = res.result.upserted[0]._id;
        socket.emit('dbchanges', data);

    }
    
    return {
        insertOrUpdate: _insertOrUpdate,
        connect: _connect,
        query: _query,
        getAll: _getAll,
        getCollection: _getCollection,
        getSingle: _getSingle,
        deleteCollection: _deleteCollection,
        saveSchema: _saveSchema,
        getSchema: _getSchema,
        pushObject: _pushObject,
        getSet: _getSet,
        pullObject: _pullObject,
        addToSet: _addToSet
     
    };
})();
// node.js module export
module.exports = Dal;