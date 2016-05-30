/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */


DynamicData.controller('SchemaCtrl', ['$scope', '$rootScope', '$mdSidenav', '$http', '$mdDialog', '$resource', '$mdToast', '$animate', '$Models', '$timeout', '$Cache',
    function ($scope, $rootScope, $mdSidenav, $http, $mdDialog, $resource, $mdToast, $animate, $Models, $timeout, $Cache) {
        
        var dbApi = $resource('/api/schemas');
        var noSqlApiDirectives = $resource('/directives');
        $rootScope["allDbs"] = [];
        $scope.editorData = {}
        $scope.Saved = false;
        $scope.alerts = [];
        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);

        };
        
        dbApi.get({ "_id": $scope.$parent.$parent.schemaid }, function (data) {
            $scope.editorData.db = data.items[0];
            $rootScope = data.items[0];
            $scope.fromJson = false;
            $scope.model = {};
            $scope.model.data = {};
            $scope.$root.allDbs.push(data.items[0]);
            
        }, function (data) {
            console.log("error");
        })
        
        
        
        
        $scope.triggerParentChange = function () {
            fixProperties($scope.editorData.db);
        }
        
        $scope.$watch("editorData.db", function (newVal, oldVal) {
            if (newVal !== undefined)
                $scope.editorData.StringfiedSchema = JSON.stringify($scope.editorData.db, null, '\t');
        }, true);
        
        $scope.UpdateSchemaFromJson = function () {
            $scope.editorData.db = JSON.parse($scope.editorData.StringfiedSchema);
        }
        $scope.UpdateSchemaFromData = function () {
          
            var dataObj = JSON.parse($scope.editorData.DataSchema);
            var schemaObj = { properties: {} };
            
            $scope.recurseBuildProperties(dataObj, schemaObj);
            $scope.editorData.db.properties = schemaObj.properties;


        }
        
        $scope.recurseBuildProperties = function (dataObj, schemaObj) {
            
            for (var key in dataObj) {
                if (dataObj[key] === null) {
                    schemaObj.properties[key] = { "key": key, properties: {}, "title": key, "type": { "name": "string" } }
                    schemaObj.properties[key].form = schemaFormDefinitionsSupport[schemaObj.properties[key].type.name][0];
                } else {
                    
                    
                    
                    switch (typeof (dataObj[key])) {
                        case "boolean":
                            schemaObj.properties[key] = { "key": key, properties: {}, "title": key, "type": { "name": "boolean" } }
                            schemaObj.properties[key].form = schemaFormDefinitionsSupport[schemaObj.properties[key].type.name][0];
                            
                            break;
                        case "string":
                            schemaObj.properties[key] = { "key": key, properties: {}, "title": key, "type": { "name": "string" } }
                            schemaObj.properties[key].form = schemaFormDefinitionsSupport[schemaObj.properties[key].type.name][0];
                            break;
                        case "object":
                            
                            if (dataObj[key] !== null && dataObj[key].length > 0) {
                                
                                schemaObj.properties[key] = { "key": key, items: { properties: {} }, "title": key, "type": { "name": "array" } }
                                $scope.recurseBuildProperties(dataObj[key][0], schemaObj.properties[key].items);
                            }
                            else {
                                schemaObj.properties[key] = { "key": key, properties: {}, "title": key, "type": { "name": "object" } }
                                $scope.recurseBuildProperties(dataObj[key], schemaObj.properties[key]);
                            }
                            schemaObj.properties[key].form = schemaFormDefinitionsSupport[schemaObj.properties[key].type.name][0];
                          
                            
                            break;

                    }
                }

                
            }
        }
        
        function fixProperties(newVal) {
            
            if (newVal === undefined)
                return;
            for (var key in newVal.properties) {
                if (newVal.properties[key].key === undefined)
                    continue;
                
                if (newVal.properties[newVal.properties[key].key] !== undefined)
                    continue;
                
                
                newVal.properties[newVal.properties[key].key] = newVal.properties[key];
                delete newVal.properties[key];
            }
            for (var key in newVal.properties) {
                fixProperties(newVal.properties[key]);
            }

        }
        
        
        
        
        
        $rootScope.CreateSchema = function (schemaName) {
            
            return {
                name: schemaName,
                schema : {
                    fields: []
                }
            }
        };
        
        
        $scope.saveSchema = function () {
            
            dbApi.save($scope.editorData.db , function () {
                $scope.alerts.push({ type: 'success', msg: 'success.' });
                $scope.Saved = true;
             
                $Cache["schemas"][$scope.editorData.db._id] = $scope.editorData.db;
                $timeout(function () { $scope.Saved = false; }, 3000)
            }, function () {
                
            })
        }
        
        $scope.AddSibiling = function () {
            
            var counter = 0;
            if ($scope.editorData.db.properties === undefined)
                $scope.editorData.db.properties = {}
            
            counter = Object.keys($scope.editorData.db.properties).length;
            
            $scope.editorData.db.properties["property" + counter] = CreateField();
        }
        
        
        $scope.InsertChild = function (item) {
            
            debugger

            if (item.children === undefined)
                item.children = [];
            
            item.children.push(CreateField());
        }
        
        
        
        $scope.DeleteField = function (item) {
            
            delete $scope.parentCollection[item.key];
            $scope.triggerParentChange();

            //for (var i = 0; i < $scope.$root.allDbs.length; i++) {
            //    if (item === $scope.$root.allDbs[i].schema.fields[i])
            //        $scope.editorData.db.schema.fields.splice(i, 1);

            //}
        }
        
        
        
   

        
    }]);


DynamicData.directive("schemaInput", function (RecursionHelper) {
    return {
        restrict: "E",
        templateUrl: "modules/schemas/SchemaInput.html",
        scope: {
            parentCollection: "=",
            propertyName: "=",
            property: "=",
            parentid: "="
            
        },
        controller: [
            "$scope", "$controller", "$rootScope", "$mdDialog", "$resource", function ($scope, $controller, $rootScope, $mdDialog, $resource) {
                $scope.Id = $scope.$id;
                $scope.collapsed = true;

                $scope.GetPropertyCount = function (property) {
                    return Object.keys(property.properties).length;
                
                }
                $scope.Directives = [{ "name": "string" }, { "name": "date" },
                    { "name": "boolean" },
                    { "name": "array", schema: { "items": { type: "string", properties: {}, enum: [] } } }, 
                    { "name": "object" }];
                // $rootScope.types;
                
                $scope.triggerParentChange = function () {
                    
                    if ($scope.$parent.triggerParentChange !== undefined)
                        $scope.$parent.triggerParentChange();
        
                }
                
                $scope.$watch("property", function (newVal, oldVal) {
                    
                    if (newVal === undefined)
                        return;
                    
                    $scope.triggerParentChange();
                   
                }, true);
                
                
                
                
                
                $scope.InsertChild = function (item) {
                    debugger
                    if (item.type.name === 'array') {
                        //create the items collection
                        if (item.items === undefined || item.items.properties === undefined)
                            item.items = { type: { name: "object" }, "properties": {} };
                        
                        var counter = Object.keys(item.items.properties).length;
                        item.items.properties["property" + counter] = CreateField();
 


                    }
                    else {
                        if (item.properties === undefined)
                            item.properties = {};
                        
                        
                        var counter = Object.keys(item.properties).length;
                        item.properties["property" + counter] = CreateField();
                        
                    }

                    
                }
                $scope.TypeProperties = function (property) {
                    
                    $mdDialog.show({
                        controller: DialogController,
                        templateUrl: 'modules/schemas/propertiesDialog.html',
                        locals: { property: property },
                        parent: angular.element(document.body),
                        
                        clickOutsideToClose: true
                    });

                    //.then(function (answer) {
                    //    $scope.property.metaData = answer;
                    //    var api = $resource('/api/' + answer.collection);
                    //    api.get({}, function (data) {
                            
                    //        $scope.data = data.items;
                    //    });
                    //}, function () {
                    //    $scope.status = 'You cancelled the dialog.';
                    //});
                };
                function DialogController($scope, $mdDialog, $resource, $compile, $timeout, property) {
                    $scope.inputTypes = JSON.parse(JSON.stringify( schemaFormDefinitionsSupport));
                    
                    
                    $scope.hasObj = true;
                    
                    
                    
                    
                    
                    $scope.property = property;
                    //$timeout(function () {
                    //    angular.element(document.getElementById('data')).append($compile("<dialog-" + dialogType + "></dialog-" + dialogType + ">")($scope));
                    
                    //}, 10);
                    
                    
                    if ($scope.property.form === undefined)
                        $scope.property.form = {};
                    //if ($scope.property.form.enum === undefined)
                    //    $scope.property.form.enum = [];
                    
                    if (_.isEmpty($scope.property.form.lookup) && !_.isEmpty($scope.property.form.enum)) {
                        $scope.showLookupOrEnum = 0;
                    }
                    else {
                        $scope.showLookupOrEnum = 1;
                    }
                    
                    
                    var api = $resource('/api/schemas');
                    api.get({}, function (data) {
                        $scope.schemas = data.items;
                        
                        $scope.schemasObject = {};
                        for (var i = 0; i < $scope.schemas.length; i++) {
                            $scope.schemasObject[$scope.schemas[i].name] = $scope.schemas[i];
                        }
                    
                    })
                    
                    
                    
                    
                    //$scope.$watch('collection', function (newVal, oldVal) {
                    //    $scope.collectionSelected = angular.fromJson($scope.collection);
                    //    $scope.dialogReturnValue = {};
                    //    $scope.dialogReturnValue.collection = $scope.collectionSelected.name;
                    
                    //});
                    $scope.resetValue = function () {
                        
                        if ($scope.showLookupOrEnum === 1) {
                            $scope.enum = [];
                        }
                        else {
                            $scope.lookup = {};
                        }
                    }
                    
                    $scope.$watch("property.form.type", function (newVal, oldval) {
                        $scope.tempInput = newVal;
                    });
                    
                    //$scope.selected = function () {
                    
                    //    $scope.tempInput = _.find($scope.inputTypes, function (item) { return item.key === $scope.property.form.type });
                    //}
                    
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.answer = function () {
                        
                        $mdDialog.hide();
                    };
                }
                
                
                
                //$scope.selectOptions = {
                //    placeholder: "Select field type",
                //    dataTextField: "type",
                //    dataValueField: "type",
                //    dataSource: $scope.$root.types
                //}
                $scope.family_type = "Input";
                
                
                $scope.DeleteField = function (item) {
                    delete $scope.parentCollection[item.key];
                    $scope.triggerParentChange();
                  
                   //var arr =  findInDocument($scope.editorData.db.properties, item);
                 
                    //var parent = $scopeId($scope.parentid);
                    //if (parent.field !== undefined) {
                    //    delete parent.field.properties[item.key];
                    //    $scope.triggerParentChange();
                    //}
                }
            }],        
        compile: function (element, $controller) {
            return RecursionHelper.compile(element, function (scope, iElement, iAttrs, controller, transcludeFn) {
                
                
                scope.CollapseChildren = function () {
                    
                    scope.collapsed = !$scope.collapsed;
                }
              
            });
        }
    }
});


function CreateField() {
    
    
    return {
        "title": "Name",
        "description": "",
        "type": "string",
        //"pattern": "^[^/]*$",
        //"minLength": 2,
        "properties": {}
         
    }
};




window.$scopeId = function (id) {
    
    function findRoot(el) {
        var child = el.firstChild;
        if (!child) return;
        do {
            var $el = angular.element(el);
            
            if ($el.data('$scope')) {
                return $el.data('$scope').$root;
            }
            
            var res = findRoot(child);
            if (res) return res;

        } while (child = child.nextSibling);
    }
    
    function dig(scope, breadcrumb) {
        var newBreadcrumb = breadcrumb.slice(0);
        newBreadcrumb.push(scope.$id);
        
        if (scope.$id == id) {
            //	console.log(newBreadcrumb);
            return scope;
        }
        
        var child = scope.$$childHead;
        
        if (!child) return;
        
        do {
            var res = dig(child, newBreadcrumb);
            if (res) return res;
        } while (child = child.$$nextSibling);

    }
    
    return dig(findRoot(document), []);
};

