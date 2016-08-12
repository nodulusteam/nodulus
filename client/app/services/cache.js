angular.module("Cache", []).
service('$Cache', function ($resource, $Config) {
    
    var instance = this;
    var apiUrl = "@nodulus/api/";
    this.setState = function (collectionName, state) {
        if (this.states[collectionName] === undefined) {
            this.states[collectionName] = { callbacks: [], status: state };
        }
        else {
            this.states[collectionName].state = state;
        }
    }
    
    this.states = {};
    
    this.ready = function (collectionName, arrids, callback) {
        
        //if (this[collectionName] === undefined)
        //    this[collectionName] = {};
        //roi
        if (this.states[collectionName] === undefined) {
            this.states[collectionName] = { callbacks: [], status: 'empty' };
        }
        
        if (isFunction(arrids)) {
            callback = arrids;
            switch (this.states[collectionName].status) {
                case 'empty':
                    this.states[collectionName].status = 'loading';
                    var genres = $resource(apiUrl + collectionName);
                    genres.get({}, function (data) {

                        if (data != null && data.items)
                        {
                            var col = {};
                            for (var i = 0; i < data.items.length; i++) {
                                col[data.items[i]["_id"]] = data.items[i];
                            }

                            instance[collectionName] = col;
                            instance.states[collectionName].status = 'ready';
                            callback(toArray(instance[collectionName]));
                            for (var i = 0; i < instance.states[collectionName].callbacks.length; i++)
                                instance.states[collectionName].callbacks[i](toArray(instance[collectionName]));

                        }
                      
                    });
                    
                    break;
                case 'loading':
                    this.states[collectionName].callbacks.push(callback);
                    
                    break;
                case 'ready':
                    
                    callback(toArray(instance[collectionName]));
                    break;
            }
           

            
        }
        else {
            if (this[collectionName] === undefined)
                this[collectionName] = {};
            
            
            var finalItemList = [];
            for (var i = 0; i < arrids.length; i++) {
                if (this[collectionName][arrids[i]] !== undefined) {
                    finalItemList.push(this[collectionName][arrids[i]]);
                }
            }
            for (var i = 0; i < finalItemList.length; i++) {
                var index = arrids.indexOf(finalItemList[i]._id);
                if (index > -1)
                    arrids.splice(index, 1);
               
            }
            
            if (arrids.length == 0)
                callback(finalItemList);
            
            
            
            
            for (var i = 0; i < arrids.length; i++) {
                var genres = $resource(apiUrl + collectionName);
                genres.get({ "_id": arrids[i] }, function (data) {
                    var col = {};
                    for (var x = 0; x < data.items.length; x++) {
                        instance[collectionName][data.items[x]["_id"]] = data.items[x];
                        finalItemList.push(data.items[x]);
                    }
                    
                    if (arrids.length === i)
                        callback(finalItemList);
                });
                    
                
                
                
            }
        }
    }

    this.setCache = function (collectionName, obj) {
        this.states[collectionName] = { state : 'ready' };
        this[collectionName] = obj;
    
    }


})

.service("$Models", ['$resource', '$rootScope', function ($resource, $rootScope) {
        
        this.Models = {};
        var dbApi = $resource(apiUrl + 'schemas');
        this.getSchemas = function (id) {
            dbApi.get({ "_id": id }, function (data) {
                this.db = data.items[0];
                $rootScope = data.items[0];
            }, function (data) {
                console.log("error");
            })
        }
        
        this.getSchemasByName = function (name, callback) {
            dbApi.get({ "name": name }, function (data) {
                
                this.db = data.items[0];
                $rootScope = data.items[0];
                callback(data.items[0]);
            }, function (data) {
                console.log("error");
            })
        }
        
        this.ResolvePropertyValue = function (strKey, obj, tabs) {
            
            
            var tt = strKey.split('.');
            var curProp = {};
            if (this.Models[obj])
                return assign(this.Models[obj], tt, {});
        }
        
        function assign(obj, keyPath, value) {
            lastKeyIndex = keyPath.length - 1;
            
            for (var i = 0; i < lastKeyIndex; ++i) {
                
                key = keyPath[i];
                if (!(key in obj))
                    obj[key] = {}
                obj = obj[key];
            }
            if (obj[keyPath[lastKeyIndex]] === undefined)
                return obj[keyPath[lastKeyIndex]] = value;
            else
                return obj[keyPath[lastKeyIndex]];
        }
        
        this.Set = function (modelId, key, value) {
            
            if (this.Models[modelId] === undefined) {
                this.Models[modelId] = {};
            }
            var tt = key.split('.');
            var curProp = this.Models[modelId];
            for (var i = 0; i < tt.length; i++) {
                curProp[tt[i]] = {};
                
                if (i < tt.length - 1)
                    curProp = curProp[tt[i]];
                else
                    curProp[tt[i]] = value;
            }
        }
    }])

.service('$Broker', function ($resource, $Config, $Models) {
    var instance = this;
    instance.Models = $Models;
    this.Objects = {};
    this.get = function () {
        for (var key in this.Objects) {
            return this.Objects[key];
        }
    }
    this.ready = function (colName, id , callback) {
        var res = $resource(apiUrl + colName);
        
        res.get({ "_id": id }, function (data) {
            
            
            if (data.items.length > 0) {
                instance.Objects[colName + "_" + id] = revive(data.items[0]);
            }
            else {
                instance.Objects[colName + "_" + id] = { _id: id };
            }
            
            
            callback(instance.Objects[colName + "_" + id]);

        });
    }
    
    function revive(obj) {            
        for (var key in obj) {            
            if (angular.isObject(obj[key]))
                revive(obj[key]);
            else
                obj[key] = reviveType(obj[key]);
        }
        return obj;
    }
    
    
    
    this.set = function (modelName, id, key, value) {
        var modelKey = modelName + "_" + id;
        if (this.Objects[modelKey] === undefined) {
            this.Objects[modelKey] = {};
        }
        var tt = key.split('.');
        var curProp = this.Objects[modelKey];
        for (var i = 0; i < tt.length; i++) {
            curProp[tt[i]] = {};
            
            if (i < tt.length - 1)
                curProp = curProp[tt[i]];
            else
                curProp[tt[i]] = value;
        }
    }

})



function toArray(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push(obj[key]);
    }
    return arr;

}
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


function reviveType(value) {
    var match = null;
    if (typeof value === "string" && (match = value.match(regexIso8601))) {
        var milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
            return new Date(milliseconds);
        }
    }
    return value;
}


var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;


//touch
