var Dal = (function () {
    
    
    var util = require('util');
    var fs = require('fs');
    var path = require('path');
    
    var impl = require('./impl/mongodb.js');
    
    //fs.readFile('./config/site.json', 'utf8', function (err, data) {
    //    if (err) throw err;
    //    obj = JSON.parse(data);
    //});   
    
    var private_variable = 'value';
    function private_function() {
        return obj;
    }
    
    function _query(queryStr, params, callback) {
        impl.query(queryStr, params, callback);
    }
    function _connect(callback) {
        impl.connect(callback);
    }
    function _getAll(queryStr, params, callback) {
        impl.getAll(queryStr, params, callback);
    }
    
    function _getCollection(name, callback) {
        impl.getCollection(name, callback);
    }
    
    function _getSchema(name, callback) {
        impl.getSchema(name, callback);
    }
    
    function _saveSchema(name, schema, callback) {
        impl.saveSchema(name, schema, callback);
    }
    
    
    function _deleteCollection(name, id, callback) {
        impl.deleteCollection(name, id, callback);
    }
    function _getSingle(name, id, callback) {
        impl.getSingle(name, id, callback);
    }
    
    function _pushObject(id, collectionName, propertyName, pushObject, callback) {
        impl.pushObject(id, collectionName, propertyName, pushObject, callback);
    }
    
    function _pullObject(id, collectionName, propertyName, pullObject, callback) {
        impl.pullObject(id, collectionName, propertyName, pullObject, callback);
    }
    function _getSet(idArr, collection, callback) {
        impl.getSet(idArr, collection, callback);
    }
    
    function _addToSet(id, collectionName, propertyName, pushObject, callback) {
        impl.addToSet(id, collectionName, propertyName, pushObject, callback);
    }
    
    
    return {
        connect: _connect,
        query: _query,
        getSchema: _getSchema,
        saveSchema: _saveSchema,
        deleteCollection: _deleteCollection,
        getAll: _getAll,
        getSingle: _getSingle,
        getCollection: _getCollection,
        pushObject: _pushObject,
        getSet: _getSet,
        pullObject: _pullObject,
        addToSet: _addToSet
    };
})();
// node.js module export
module.exports = Dal;