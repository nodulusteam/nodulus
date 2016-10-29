angular.module('DynamicDataSerivces', [])
.service("$Models",['$resource','$rootScope', function ($resource,$rootScope) {
    
     
    
        this.Models = {};
        var dbApi = $resource('@nodulus/api/schemas');
        this.getSchemas = function (id){
            dbApi.get({ "_id": id }, function (data) {
                this.db = data.items[0];
                $rootScope = data.items[0];
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
