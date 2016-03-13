/*
 * diskDB
 * http://arvindr21.github.io/diskDB
 *
 * Copyright (c) 2014 Arvind Ravulavaru
 * Licensed under the MIT license.
 */

var util = require('./util'),
    path = require('path'),
    uuid = require('node-uuid');

module.exports = function (db, collectionName) {
    var coltn = {};
    coltn.collectionName = collectionName;
    coltn._f = path.join(db._db.path, (collectionName + '.json'));
    
    
    
    
    coltn.toArray = function (callback) {
        
        if (!this.results)
            this.results = [];
        
        callback(null, this.results);

      
    };
    
    
    coltn.find = function (query, callback) {
        var collection = JSON.parse(util.readFromFile(this._f));
        if (query["$query"])
            query = query["$query"];
        
        if (!query || Object.keys(query).length == 0) {
            this.results = collection;            
        } else {
            this.query = query;
            var searcher = new util.ObjectSearcher();
            this.results = searcher.findAllInObject(collection, query, true);
            //return util.finder(collection, query, true);
        }        
        return this;
    };
    
    coltn.findOne = function (query) {
        var collection = JSON.parse(util.readFromFile(this._f));
        if (!query) {
            return collection[0];
        } else {
            var searcher = new util.ObjectSearcher();
            return searcher.findAllInObject(collection, query, false)[0];
            //return util.finder(collection, query, false)[0];
        }
    };
    
    coltn.save = function (data, callback) {
        var collection = JSON.parse(util.readFromFile(this._f));
        if (typeof data === 'object' && data.length) {
            if (data.length === 1) {
                if (data[0].length > 0) {
                    data = data[0];
                }
            }
            var retCollection = [];
            for (var i = data.length - 1; i >= 0; i--) {
                var d = data[i];
                d._id = uuid.v4().replace(/-/g, '');
                collection.push(d);
                retCollection.push(d);
            }
            util.writeToFile(this._f, collection);
            callback(null, { result: { upserted: retCollection } });
           // callback(null, retCollection)
           // return retCollection;
        } {
            
            var index = this.exists(data, collection);
            if (index !== false) {
                collection[index] = data;
            }
            else {
                data._id = uuid.v4().replace(/-/g, '');
                collection.push(data);
            }
            
           
            util.writeToFile(this._f, collection);
            callback(null, { result: { upserted: [data] } });
            //return data;
        }
    };
    
    coltn.exists = function (obj, collection)
    {
        for (var i = 0; i < collection.length; i++) {
            if (obj["_id"] === collection[i]["_id"])
                return i;
        }
        return false;

    }
    

    coltn.update = function (query, data, options) {
        var ret = {},
            collection = JSON.parse(util.readFromFile(this._f)); // update
        var records = util.finder(collection, query, true);
        if (records.length) {
            if (options && options.multi) {
                collection = util.updateFiltered(collection, query, data, true);
                ret.updated = records.length;
                ret.inserted = 0;
            } else {
                collection = util.updateFiltered(collection, query, data, false);
                ret.updated = 1;
                ret.inserted = 0;
            }
        } else {
            if (options && options.upsert) {
                data._id = uuid.v4().replace(/-/g, '');
                collection.push(data);
                ret.updated = 0;
                ret.inserted = 1;
            } else {
                ret.updated = 0;
                ret.inserted = 0;
            }
        }
        util.writeToFile(this._f, collection);
        return ret;
    };
    
    coltn.remove = function (query, multi) {
        if (query) {
            var collection = JSON.parse(util.readFromFile(this._f));
            if (typeof multi === 'undefined') {
                multi = true;
            }
            collection = util.removeFiltered(collection, query, multi);
            
            util.writeToFile(this._f, collection);
        } else {
            util.removeFile(this._f);
            delete db[collectionName];
        }
        return true;
    };
    
    coltn.count = function (callback) {
        var c = (JSON.parse(util.readFromFile(this._f))).length;
        if(!callback)
            return c;
        else
            callback(null, c)
    };
    
    coltn.ensureIndex = function () { }
    
    coltn.skip = function (num) {
        return this;
    }

    coltn.limit = function (num) {
        return this;
    }
    
    
    

    return coltn;
};
