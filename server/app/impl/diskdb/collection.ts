/*
 * diskDB
 * http://arvindr21.github.io/diskDB
 *
 * Copyright (c) 2014 Arvind Ravulavaru
 * Licensed under the MIT license.
 */



/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */




/// <reference path="../../../typings/main.d.ts" />
import { ObjectSearcher } from "./ObjectSearcher";
import {util} from "./util";





var 
    path = require('path'),
    uuid = require('node-uuid');




export class collection implements nodulus.IDbCollection{
        constructor(db: any, collectionName: string) {
            this.collectionName = collectionName;
            this.db = db;

            this.dbpath = path.join(db._db.path, (collectionName + '.json'));

        }
        public db: any;
        public dbpath: string;
        public results: any;
        public query: any;
        public collectionName: string;

        public toArray(callback: Function) {
            if (!this.results)
                this.results = [];
            callback(null, this.results);
        };


        public find(query: any, callback: Function) {
            var collection = JSON.parse(util.readFromFile(this.dbpath));
            if (query["$query"])
                query = query["$query"];

            if (!query || Object.keys(query).length == 0) {
                this.results = collection;
            } else {
                this.query = query;
                var searcher = new ObjectSearcher();
                this.results = searcher.findAllInObject(collection, query, true);
                //return util.finder(collection, query, true);
            }
            return this;
        };

        public next(callback: Function): any {


        };

        public each(callback: Function): any {


        };

        public findOne(query: any) {
            var collection = JSON.parse(util.readFromFile(this.dbpath));
            if (!query) {
                return collection[0];
            } else {
                var searcher = new ObjectSearcher();
                return searcher.findAllInObject(collection, query, false)[0];
                //return util.finder(collection, query, false)[0];
            }
        };

        public save(data: any, callback: Function) {
            var collection = JSON.parse(util.readFromFile(this.dbpath));
            if (typeof data === 'object' && data.length) {
                if (data.length === 1) {
                    if (data[0].length > 0) {
                        data = data[0];
                    }
                }
                var retCollection: any = [];
                for (var i = data.length - 1; i >= 0; i--) {
                    var d = data[i];
                    d._id = uuid.v4().replace(/-/g, '');
                    collection.push(d);
                    retCollection.push(d);
                }
                util.writeToFile(this.dbpath, collection);
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


                util.writeToFile(this.dbpath, collection);
                callback(null, { result: { upserted: [data] } });
                //return data;
            }
        };

        public exists(obj: any, collection: any): any {
            for (var i = 0; i < collection.length; i++) {
                if (obj["_id"] === collection[i]["_id"])
                    return i;
            }
            return false;

        }


        public update(query: any, data: any, options: any) {
            var ret: any = {},
                collection = JSON.parse(util.readFromFile(this.dbpath)); // update
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
            util.writeToFile(this.dbpath, collection);
            return ret;
        };

        public remove(query: any, multi: boolean) {
            if (query) {
                var collection = JSON.parse(util.readFromFile(this.dbpath));
                if (typeof multi === 'undefined') {
                    multi = true;
                }
                collection = util.removeFiltered(collection, query, multi);

                util.writeToFile(this.dbpath, collection);
            } else {
                util.removeFile(this.dbpath);
                 delete this.db[this.collectionName];
            }
            return true;
        };

        public count = function (callback: Function) {
            var c = (JSON.parse(util.readFromFile(this.dbpath))).length;
            if (!callback)
                return c;
            else
                callback(null, c)
        };

        public ensureIndex() { }

        public skip(num: number) {
            return this;
        }

        public limit(num: number) {
            return this;
        }
    }


 


 