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


var fs = require('fs');
var merge = require('merge');
 

    export class util {

        public static isValidPath(path: string) {
            return fs.existsSync(path);
        };

        public static writeToFile(outputFilename: string, content: any) {
            if (!content) {
                content = [];
            }
            fs.writeFileSync(outputFilename, JSON.stringify(content, null, 0));
        };

        public static readFromFile(file: string): string {
            return fs.readFileSync(file, 'utf-8');
        };


        public static readFromDirectory(path: string): any {
            return fs.readdirSync(path);

        };


        public static removeFile(file: string) {
            return fs.unlinkSync(file);
        };

        public static updateFiltered(collection: string, query: any, data: any, multi: boolean) {
            // break 2 loops at once - multi : false
            loop: for (var i = collection.length - 1; i >= 0; i--) {
                var c: any = collection[i];
                for (var p in query) {
                    if (p in c && c[p] == query[p]) {
                        collection[i] = merge(c, data);
                        if (!multi) {
                            break loop;
                        }
                    }
                }
            }
            return collection;
        };

        // [TODO] : Performance
        public static removeFiltered(collection: Array<any>, query: any, multi: boolean) {
            // break 2 loops at once -  multi : false
            loop: for (var i = collection.length - 1; i >= 0; i--) {
                var c: any = collection[i];
                for (var p in query) {
                    if (p in c && c[p] == query[p]) {
                        collection.splice(i, 1);
                        if (!multi) {
                            break loop;
                        }
                    }
                }
            }
            return collection;
        };

        // [TODO] : Performance
        public static finder = function (collection: Array<any>, query: any, multi: boolean) {
            var retCollection: Array<any> = [];
            loop: for (var i = collection.length - 1; i >= 0; i--) {
                var c = collection[i];
                for (var p in query) {
                    if (p in c && c[p] == query[p]) {
                        retCollection.push(collection[i]);
                        if (!multi) {
                            break loop;
                        }
                    }
                }
            }
            return retCollection;
        };

       

    }

  






 


 
