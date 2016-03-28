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
 @ewave open source | ©Roi ben haim  ®2016    
 */
/// <reference path="../../../typings/main.d.ts" />

//global modules
var path = require('path'),
    c = require('chalk'),
    e = c.red,
    s = c.green;

 
 

import {collection} from "./collection";
import {util} from "./util";


export  class db {
    _db: any = {};
    collections: any = {};
        public connect(path: string, collections: any): any {
            if (util.isValidPath(path)) {
                this._db.path = path;

                console.log(s('Successfully connected to : ' + path));
                if (collections) {
                    this.loadCollections(collections);
                }
            } else {
                console.log(e('The DB Path [' + path + '] does not seem to be valid. Recheck the path and try again'));
                return false;
            }
            return this;
        }
        public listCollections() {

            var list = util.readFromDirectory(this._db.path);
            for (var i = 0; i < list.length; i++) {
                list[i] = { name: list[i].split('.json')[0] };

            }

            var col = new collection(this, "collections");
            col.results = list;

            return col;




        };
        public loadCollections(collections: any): any {
            if (!this._db) {
                console.log(e('Initialize the DB before you add collections. Use : ', 'db.connect(\'path-to-db\');'));
                return false;
            }
            if (typeof collections === 'object' && collections.length) {
                for (var i = 0; i < collections.length; i++) {
                    var p = path.join(this._db.path, (collections[i].indexOf('.json') >= 0 ? collections[i] : collections[i] + '.json'));
                    if (!util.isValidPath(p)) {
                        util.writeToFile(p, []);
                    }
                    var _c: string = collections[i].replace('.json', '');
                    this.collections[_c] = new collection(this, _c);
                }
            } else {
                console.log(e('Invalid Collections Array.', 'Expected Format : ', '[\'collection1\',\'collection2\',\'collection3\']'));
            }
            return this;
        }
}

 

 
 
 
