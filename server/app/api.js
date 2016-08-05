"use strict";
const express = require("express");
var dal = require("@nodulus/data");
var ObjectID = require("mongodb").ObjectID;
class api {
    cleanEntityFramework(body, level) {
        if (body != null) {
            for (var key in body) {
                if (key.indexOf("$") == 0 || key == "EntityKey") {
                    delete body[key];
                    continue;
                }
                if (Array.isArray(body[key])) {
                    for (var x = 0; x < body[key].length; x++) {
                        var subObj = body[key][x];
                        this.cleanEntityFramework(subObj, level++);
                    }
                }
                if (typeof (body[key]) == "object" && body[key] !== null) {
                    this.cleanEntityFramework(body[key], level++);
                }
            }
        }
    }
    getOperator(key) {
        var ops = {
            "$gt": ">"
        };
        if (ops[key] === undefined)
            return key;
        return ops[key];
    }
    start(app) {
        var router = express.Router();
        router.route('/*')
            .get(function (req, res) {
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
            dal.get(entity, searchCommand, specialCommand, aggregateCommand, (result) => {
                res.json(result);
            });
        })
            .post(function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
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
                    dal.query(query, body[i], function (apiResult) {
                        var data = { items: apiResult.ops };
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
                dal.query(query, body, function (apiResult) {
                    var data = { items: apiResult.ops };
                    global["eventServer"].emit(entity + " UPDATE", data);
                    res.end(JSON.stringify(data));
                });
            }
        })
            .put(function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
            var entity = req.params[0];
            var and = ",";
            var query = "UPDATE " + entity + " SET ";
            if (req.body != null) {
                for (var key in req.body) {
                    if (key !== "")
                        query += key + "=@" + key + and;
                }
            }
            dal.query(query, req.body, function (apiResult) {
                var data = { items: apiResult.ops };
                global["eventServer"].emit(entity + " UPDATE");
                res.end(JSON.stringify(data));
            });
        }).delete(function (req, res) {
            if (!req.body)
                return res.sendStatus(400);
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
                var data = { items: apiResult.ops };
                res.end(JSON.stringify(data));
            });
        });
        app.use('/api', router);
    }
}
exports.api = api;
class SpecialCommand {
}
class SearchCommand {
}
class AggregateCommand {
}
