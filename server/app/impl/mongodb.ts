/*                 _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016 
 */
/// <reference path="../../typings/main.d.ts" />

var util = require('util');
var fs = require('fs');
var path = require('path');
var config = require('../config.js');
var ObjectID = require("mongodb").ObjectID;

var assert = require('assert');


export class dal implements nodulus.IDal {

        db: any;

        public mongoOperator(key: string) {
            var ops: any = {
                "=": "$eq",
                "!=": "$ne",
                ">": "$gt",
                ">=": "$gte",
                "<": "$lt",
                "<=": "$lte",
                "in": "$in"

            }

            if (ops[key] === undefined)
                return key;

            return ops[key];


        }


        public parse(str: string, params: any) {
            var res: any = { queryMode: null, collection: "", where: {}, values: {}, limit: 0 }

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



                    res.collection = x[i + 1];
                    res.values = params;

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

                        var operator = this.mongoOperator(triple[0].replace(cleankey, '').trim());

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




        public getAll(callback: Function) {
            var url = config.appSettings().database.mongodb.host;
            var Db = require('mongodb').Db;
            var Server = require('mongodb').Server;

            var db = new Db('scripter', new Server('localhost', 27017));
            // Establish connection to db
            db.open(function (err: any, db1: any) {
                assert.equal(null, err);
                // Return the information of a all collections, using the callback format
                db.collections(function (err: any, items: any) {
                    assert.ok(items.length > 0);
                    var fitems: any = [];
                    for (var i = 0; i < items.length; i++) {
                        fitems.push(items[i].s.name);
                    }
                    callback(fitems);
                });
            });
        }

        public getCollection(name: string, callback: Function) {
            this.query("SELECT * FROM " + name, {}, callback);
        }

        public getSingle(name: any, id: any, callback: Function) {

            this.connect(function (err: any, db: any) {
                assert.equal(null, err);



                db.collection(name).findOne({ "_id": ObjectID(id) }, function (err: any, doc: any) {
                    if (err !== null || doc === null)
                        callback({ "error": "not found" });
                    else
                        callback(doc);
                });


            });

        }


        public connect(callback: Function) {
            var url = config.appSettings().database.mongodb.host;
            var MongoClient = require('mongodb').MongoClient;
            if (this.db === null) {
                MongoClient.connect(url, function (err: any, db: any) {

                    this.db = db;
                    callback(err, db);
                });
            } else {
                callback(null, this.db);
            }


        }

        public saveSchema(name: string, schema: any, callback: Function) {
            this.query("INSERT INTO schemas name=@name, schema=@schema", { "name": name, "schema": schema }, callback);
        }

        public getSchema(name: string, callback: Function) {
            this.query("SELECT * FROM schemas WHERE name=@name", { "name": name }, callback);
        }


        //function _insertOrUpdate(queryStr, params, callback) {

        //    var oQuery = parse(queryStr, params);
        //    var url = config.appSettings().mongodb.host;
        //    var MongoClient = require('mongodb').MongoClient;

        //    collection.insert({ hello: 'world_no_safe' });

        //}

        public deleteCollection(collection: string, id: string, callback: Function) {
            var url = config.appSettings().database.mongodb.host;
            var MongoClient = require('mongodb').MongoClient;
            this.connect(function (err: any, db: any) {
                assert.equal(null, err);

                db.collection(collection).findAndRemove({ "id": id }, function (err: any, doc: any) {
                    assert.equal(null, err);

                    callback(doc);
                });
            });
        }



        public addToSet(id: string, collection: string, propertyName: string, pushObject: any, callback: Function) {
            this.connect(function (err: any, db: any) {
                assert.equal(null, err);

                var pusher: any = {};
                pusher[propertyName] = pushObject;
                db.collection(collection).update({ _id: id }, { $addToSet: pusher }, function (err: any, data: any) {

                    callback(data);
                });



            });



        }


        public pushObject(id: string, collection: string, propertyName: string, pushObject: any, callback: Function) {
            this.connect(function (err: any, db: any) {
                assert.equal(null, err);

                var pusher: any = {};
                pusher[propertyName] = pushObject;
                db.collection(collection).update({ _id: id }, { $push: pusher }, function (err: any, data: any) {

                    callback(data);
                });



            });



        }

        public pullObject(id: string, collection: string, propertyName: string, pullObject: any, callback: Function) {
            this.connect(function (err: any, db: any) {
                assert.equal(null, err);
                var puller: any = {};

                puller[propertyName] = pullObject;

                db.collection(collection).update({ _id: id }, { $pull: puller }, function (err: any, data: any) {
                    callback(data);
                });
            });
        }

        public getSet(idArr: any, collection: string, callback: Function) {

            if (typeof (idArr) == "string")
                idArr = [idArr];


            this.connect(function (err: any, db: any) {
                assert.equal(null, err);
                db.collection(collection).find({ _id: { "$in": idArr } }).toArray(function (err: any, data: any) {
                    callback(data);
                });
            });
        }




        public query(queryStr: string, params: any, callback: Function) {
            var oQuery = this.parse(queryStr, params);




            //if (oQuery.where["$query"]["_id"] !== undefined) {
            //    oQuery.where["$query"]["_id"] = { ObjectID(oQuery.where["_id"]);
            //}


            this.connect(function (err: any, db: any) {
                assert.equal(null, err);

                switch (oQuery.queryMode) {
                    case "INSERT":

                        if (oQuery.values["_id"] === undefined)
                            oQuery.values["_id"] = require("node-uuid").v4();

                        db.collection(oQuery.collection).save(oQuery.values
                            , function (err: any, result: any) {
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
                            , function (err: any, result: any) {
                                //if (result.result.ok == 1) {
                                //    sendToArchive(oQuery, result);
                                //}
                                assert.equal(err, null);
                                console.log("deleted document from " + oQuery.collection);
                                callback(result);
                            });

                        break;


                    case "UPDATE":
                        db.collection(oQuery.collection).update(oQuery.where, oQuery.values
                            , function (err: any, result: any) {

                                assert.equal(err, null);
                                console.log("updated document from " + oQuery.collection);
                                var cursor = db.collection(oQuery.collection).find(oQuery.where);
                                var retArr: any = [];
                                cursor.each(function (err: any, doc: any) {
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
                        var retArr: any = [];
                        var cursor: any;
                        var whereFlag = false;
                        for (var i in oQuery.where)
                            whereFlag = true;

                        if (whereFlag)
                            cursor = db.collection(oQuery.collection).find(oQuery.where);
                        else
                            cursor = db.collection(oQuery.collection).find();

                        if (oQuery.limit === undefined)
                            oQuery.limit = 0;



                        cursor.limit(oQuery.limit).each(function (err: any, doc: any) {
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

        public sendToArchive(data: any, res: any) {

            //if (res.result.upserted !== undefined)
            //    data.docIdentifier = res.result.upserted[0]._id;
            //socket.emit('dbchanges', data);

        }



    }

 

 

