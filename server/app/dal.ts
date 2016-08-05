/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
/// <reference path="../typings/main.d.ts" />

import * as data from "./impl/datafactory";

class dalClass {
        public impl: any = null;

        ////var util = require('util');
        ////var fs = require('fs');
        ////var path = require('path');
        ////var config = require('./config.js');
        ////var impl: any = null;// require('./impl/mongodb.js');



        public query(queryStr: string, params: any, callback: Function) {
            if (this.impl === null) {
                if (global.config.appSettings.database) {

                    if (global.config.appSettings.database.diskdb)
                        this.impl = data.DataFactory.createDal("diskdb");
                    else
                        this.impl = data.DataFactory.createDal("mongodb");

 
                }
            }


            this.impl.query(queryStr, params, callback);
        }

        public connect(callback: Function) {

            if (this.impl === null) {
                if (global.config.appSettings.database) {
                    var factory = new data.DataFactory();
                     
                    
                    if (global.config.appSettings.database.diskdb)
                        this.impl = data.DataFactory.createDal("diskdb");
                    else
                        this.impl = data.DataFactory.createDal("mongodb");
                }
            }



            if (this.impl !== null) {


                this.impl.connect(callback);
            } else {
                callback({ "error": "no database option" }, null);

            }
        }

        public getAll(queryStr: string, params: any, callback: Function) {
            this.impl.getAll(queryStr, params, callback);
        }

        public getCollection(name: string, callback: Function) {
            this.impl.getCollection(name, callback);
        }

        public getSchema(name: string, callback: Function) {
            this.impl.getSchema(name, callback);
        }

        public saveSchema(name: string, schema: any, callback: Function) {
            this.impl.saveSchema(name, schema, callback);
        }

        public deleteCollection(name: string, id: string, callback: Function) {
            this.impl.deleteCollection(name, id, callback);
        }

        public getSingle(name: string, id: string, callback: Function) {
            this.impl.getSingle(name, id, callback);
        }

        public pushObject(id: string, collectionName: string, propertyName: string, pushObject: any, callback: Function) {
            this.impl.pushObject(id, collectionName, propertyName, pushObject, callback);
        }

        public pullObject(id: string, collectionName: string, propertyName: string, pullObject: any, callback: Function) {
            this.impl.pullObject(id, collectionName, propertyName, pullObject, callback);
        }

        public getSet(idArr: Array<string>, collection: string, callback: Function) {
            this.impl.getSet(idArr, collection, callback);
        }

        public addToSet(id: string, collectionName: string, propertyName: string, pushObject: any, callback: Function) {
            this.impl.addToSet(id, collectionName, propertyName, pushObject, callback);
        }

        public get(entity: string, searchCommand: nodulus.SearchCommand, specialCommand: nodulus.SpecialCommand, aggregateCommand: nodulus.AggregateCommand, callback: Function) {
            this.impl.get(entity, searchCommand, specialCommand, aggregateCommand, callback);
        }

    }
    

export var dal: dalClass = new dalClass();
 
 



