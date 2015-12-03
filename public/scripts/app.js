angular.module("DataStudio", ['ngRoute', 'ui.ace'])
.config(function ($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
    
    
    
    
    
    $routeProvider.
    when("/COLLECTIONS", { controller: "Collections", templateUrl: "collections.html" }).
    when("/COLLECTION/:name", { controller: "Collection", templateUrl: "collection.html" }).
    when("/COLLECTION/:name/:id", { controller: "Item", templateUrl: "item.html" }).
    when("/SCHEMA/:name", { controller: "Schema", templateUrl: "schema.html" }).
    otherwise({ redirectTo: "/COLLECTIONS" });



})
.controller("Schema", ["$scope", "$http", '$routeParams', function ($scope, $http, $routeParams) {
        
        $scope.name = $routeParams.name;
        
        $http({
            method: 'POST',
            url: "/getSchema",
            data: {
                "request": { "name": $scope.name }
                    
            }
        }).success(function (data, status, headers, config) {
            $scope.schema = data[0];
        });
        
        
        $scope.SaveSchema = function () {
            
            $http({
                method: 'POST',
                url: "/saveSchema",
                data: {
                    "request": { "name": $scope.name, "schema": $scope.schema }
                    
                }
            }).success(function (data, status, headers, config) {
                $scope.schema = data;
            });
        
        
        }
    
    }])
.controller("Collections", ["$scope", "$http", function ($scope, $http) {
        
       
        
        
      
 

    
    
    }])
.controller("StudioController", ["$scope", "$http", function ($scope, $http) {
        $http({
            method: 'POST',
            url: "/getAll",
            data: {
                "request": {}
                    
            }
        }).success(function (data, status, headers, config) {
            
            $scope.Collections = data;

        });
    }])
    .controller("Collection", ["$scope", "$http", '$routeParams', function ($scope, $http, $routeParams) {
        
        $scope.collection = $routeParams.name;
        $scope.deleteRow = function (row) {
            
            
            $http({
                method: 'POST',
                url: "/deleteCollection",
                data: {
                    "request": { "name": $scope.collection, "id": row.id }
                    
                }
            }).success(function (data, status, headers, config) {
                
                
                $scope.Rows = data;

            });
        
        }
        
        $scope.getCollection = function (name) {
            
            
            $http({
                method: 'POST',
                url: "/getCollection",
                data: {
                    "request": { "name": name }
                    
                }
            }).success(function (data, status, headers, config) {
                
                
                $scope.Rows = data;

            });
        
        }
        
        
        
        
        
        $scope.getCollection($routeParams.name);
       
    }])
.controller("Item", ["$scope", "$http", '$routeParams', function ($scope, $http, $routeParams) {
        
        $scope.collection = $routeParams.name;
        var id = $routeParams.id;
        $scope.deleteRow = function (row) {
            
            
            $http({
                method: 'POST',
                url: "/deleteCollection",
                data: {
                    "request": { "name": $scope.collection, "id": row.id }
                    
                }
            }).success(function (data, status, headers, config) {
                
                
                $scope.Rows = data;

            });
        
        }
        
        $scope.getSingle = function (name, id) {
            
            
            $http({
                method: 'POST',
                url: "/getSingle",
                data: {
                    "request": { "name": name, "id": id }
                    
                }
            }).success(function (data, status, headers, config) {
                
                //debugger
                $scope.Item = data;

            });
        
        }
        
        
        
        
        
        $scope.getSingle($routeParams.name, $routeParams.id);
       
    }])
    .service('$User', function ($resource, $Config) {
    
    var instance = this;
    
    
    
    
    
    
    this.set = function (user) {
        user.Password = null;
        localStorage.setItem("OPERATOR", JSON.stringify(user));
        instance.user = user;

    }
    
    this.get = function () {
        
        var user = localStorage.getItem("OPERATOR");
        if (user === undefined)
            return false;
        else
            return JSON.parse(user);


    }
    this.LoadPatients = function (callback) {
        
        
        $Config.ready(function () {
            
            var patientsDatasource = $resource($Config.site.apiBaseUrl + "/Patients");
            if (instance.User === null)
                return;
            
            patientsDatasource.get({ "OrganizationId": instance.User.OrganizationId }, function (data) {
                instance.Patients = {}
                instance.PatientsIndex = [];
                
                
                for (var i = 0; i < data.items.length; i++) {
                    instance.PatientsIndex.push(data.items[i].Id);
                    instance.Patients[data.items[i].Id] = data.items[i];
                }
                callback();
            });
        });
       
    }
    
    
    this.redirectAfterLogin = function () {
        
        document.location.href = "../Pages/portal.html#/mytasks";
    }
    
    this.User = this.get();
    
    
    this.ready = function (callback) {
        if (instance.Patients !== undefined) {
            callback();
        }
        else {
            this.LoadPatients(callback);

        }
    }

});




