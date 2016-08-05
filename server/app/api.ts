/// <reference path="../typings/main.d.ts" />
 
/*                 _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016
 */
 
import * as http from "http";
import * as express from "express";
var dal = require("@nodulus/data");
//import {dal} from "@nodulus/data";
var ObjectID = require("mongodb").ObjectID;
 

    export class api {
		 
    //var dal = require('./dal.js');
    //var util = require('util');
    //var fs = require('fs');
    //var path = require('path');
    //var express = require('express');
    //var isObject = require('is-object');


    cleanEntityFramework(body: any, level: number) {
        if (body != null) {
            for (var key in body) {

                //                
                // if(isObject( body[key] ) && body[key].EntityKey !== undefined)
                // {
                //     //var o;
                //     //var refCollectionName = body[key].EntityKey.EntitySetName;
                //     //var _id = body[key].EntityKey.EntityKeyValues[0].Value;
                //     
                //     //body[key] = {
                //     //    "$ref" : refCollectionName,
                //     //    "$id" : _id
                //     //}
                //     
                // }
                // else
                // {
                if (key.indexOf("$") == 0 || key == "EntityKey") {

                    delete body[key];
                    continue;
                }
                //}

                if (Array.isArray(body[key])) {
                    for (var x = 0; x < body[key].length; x++) {
                        var subObj = body[key][x];
                        this.cleanEntityFramework(subObj, level++);

                    }

                }

                if (typeof (body[key]) == "object" && body[key] !== null) {
                    //&&  body[key].$ref === undefined

                    this.cleanEntityFramework(body[key], level++);
                    //for (var x in body[key]{
                    //    var subObj = body[key][x];
                    //    cleanEntityFramework(body[key], level++);

                    //}

                }
                //query += key + "=@" + key + and;
            }
        }


    }

    getOperator(key: string) {
        var ops: any = {
            "$gt": ">"
        }

        if (ops[key] === undefined)
            return key;

        return ops[key];

    }


    start(app: any) {
        var router = express.Router();
        router.route('/*')
            .get(function (req: any, res: any) {
                var entity = req.params[0];
                var searchCommand = new SearchCommand();
                var specialCommand = new SpecialCommand();
                var aggregateCommand = new AggregateCommand();
                var sortCommand = {};
                var projection = {};
                for (var key in req.query) {
                    if (key.indexOf("$") === 0) {

                        if (key === "$project")
                            aggregateCommand.$project = JSON.parse(req.query[key]);
                        else {
                            switch (key) {
                                case "$limit":
                                    specialCommand.$limit = req.query[key];
                                    break;
                                case "$skip":
                                    specialCommand.$skip = req.query[key];
                                    break;
                            }

                        }
                        if (searchCommand.$query === undefined)
                            searchCommand.$query = {};
                    }
                    else {
                        if (searchCommand.$query === undefined)
                            searchCommand.$query = {};


                        if (isNaN(req.query[key]))
                            searchCommand.$query[key] = req.query[key];
                        else
                            searchCommand.$query[key] = Number(req.query[key]);

                    }

                }

                if (req.query.$search) {
                    req.query.$search = JSON.parse(req.query.$search);
                    if (req.query.$search.term !== "")
                        searchCommand.$query["$text"] = { $search: req.query.$search.term };
                }


                if (req.query.$sort)
                    searchCommand.$orderby = JSON.parse(req.query.$sort);



                dal.get(entity, searchCommand, specialCommand, aggregateCommand, (result: any) => {
                   
                    res.json(result);

                });


                //dal.connect(function (err: any, db: any) {
                //    if (db === null) {
                //        return res.json(err);
                //    }

                //    db.collection(entity).ensureIndex(
                //        { "$**": "text" },
                //        { name: "TextIndex" }
                //    )


                //    if (specialCommand.$skip && specialCommand.$limit) {


                //        //get the item count
                //        db.collection(entity).find(searchCommand.$query).count(function (err: any, countResult: number) {
                //            db.collection(entity).find(searchCommand, aggregateCommand.$project).skip(Number(specialCommand.$skip)).limit(Number(specialCommand.$limit)).toArray(function (err: any, result: any) {

                //                var data = { items: result, count: countResult }
                //                res.json(data);
                //            });
                //        });
                //    } else {


                //        if (searchCommand.$query && searchCommand.$query["_id"]) {
                //            if (global.config.appSettings.database.mongodb.useObjectId) {
                //                searchCommand.$query["_id"] = ObjectID(searchCommand.$query["_id"]);
                //            }
                //        }


                //        db.collection(entity).find(searchCommand).toArray(function (err: any, result: any) {

                //            var data = { items: result !== null ? result : [], count: result !== null ? result.length : 0 }
                //            res.json(data);
                //        });
                //    }


                //})




            })
            .post(function (req: any, res: any) {
                if (!req.body) return res.sendStatus(400);
                var entity = req.params[0];
                var and = ",";
                var query = "INSERT INTO " + entity + " ";
                var body = req.body;
                if (body.data !== undefined)
                    body = JSON.parse(body.data);

                if (body.length !== undefined) {


                    for (var i = 0; i < body.length; i++) {
                        if (body[i].Id !== undefined) {
                            body[i]._id = body[i].Id;
                        }
                        else {
                            if (!body[i]._id || body[i]._id === null || body[i]._id === "")
                                body[i]._id = require("node-uuid").v4();

                        }
                        this.cleanEntityFramework(body[i], 0);
                        //if (body[i] != null) {
                        //    for (var key in body[i]) {
                        //        if (key.indexOf("$") == 0 || key == "EntityKey") {

                        //            delete body[i][key];
                        //            continue;
                        //        }
                        //        if (Array.isArray(body[i][key])) {
                        //            for (var x = 0; x < body[i][key].length; x++) {
                        //                var subObj = body[i][key][x];
                        //                for (var subkey in subObj) {
                        //                    if (subkey.indexOf("$") == 0 || subkey == "EntityKey") {

                        //                        delete subObj[subkey];
                        //                        continue;
                        //                    }

                        //                }
                        //            }

                        //        }
                        //        query += key + "=@" + key + and;
                        //    }
                        //}


                        dal.query(query, body[i], function (apiResult: any) {
                            var data = { items: apiResult.ops }
                            global["eventServer"].emit(entity + " UPDATE");
                            if (i == body.length)
                                res.end(JSON.stringify(data));
                        });



                    }


                }
                else {



                    if (body != null) {
                        for (var key in body) {
                            query += key + "=@" + key + and;
                        }
                    }
                    dal.query(query, body, function (apiResult: any) {
                        var data = { items: apiResult.ops }
                        global["eventServer"].emit(entity + " UPDATE", data);
                        res.end(JSON.stringify(data));
                    });
                }

            })
            .put(function (req: any, res: any) {
                if (!req.body) return res.sendStatus(400);
                var entity = req.params[0];
                var and = ",";

                var query = "UPDATE " + entity + " SET ";

                if (req.body != null) {
                    for (var key in req.body) {
                        if (key !== "")
                            query += key + "=@" + key + and;
                    }
                }
                dal.query(query, req.body, function (apiResult: any) {
                    var data = { items: apiResult.ops }
                    global["eventServer"].emit(entity + " UPDATE");
                    res.end(JSON.stringify(data));
                });

            }).delete(function (req: any, res: any) {
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
                dal.query(query, req.query, function (apiResult: any) {
                    var data = { items: apiResult.ops }
                    res.end(JSON.stringify(data));
                });

            });



        app.use('/api', router);

    }
    }

class SpecialCommand {
    $skip: any;
    $limit: any;

}

class SearchCommand {
    $query: any;
    $orderby: any;

}


class AggregateCommand {
    $project: any;


}
 
 




