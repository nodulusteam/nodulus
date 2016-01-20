DynamicData
.controller('EditItemCtrl', function ($scope, $Cache ,$IDE, $resource, $Broker, $timeout, $uibModal) {
    
    $scope.model = {}
    $scope.nameFields = [];
    $scope.getDocumentName = function () {        
        var name = "";        
        return name;
    }
    
    var tabschema = $scope.$parent.$parent.schemaid;    
    var colName = $Cache["schemas"][tabschema].name;    
    var keysArr = $scope.$parent.$parent.itemKey.split("_");    
    $scope.api = $resource("/api/" + colName);    
    $scope.itemId = keysArr[1];
    $Broker.ready(colName , keysArr[1] , function (data) {
        $scope.Item = data;
        
        $scope.StringfiedItem = JSON.stringify(data, null, '\t');
        $scope.model = data;
        $scope.Name = "";
        for (var key in $Cache.schemasByName[colName].properties) {
            formFragment = $Cache.schemasByName[colName].properties[key].form;
            if (formFragment && formFragment.nameField)
                $scope.Name += data[key] + " ";
        }

        $Cache.ready("schemas", function () {
            
            
            $scope.schema = JSON.parse(JSON.stringify($Cache.schemas[tabschema]));
            //build the form object
            $scope.form = []
            
            $scope.TempForm = [];
            
            $scope.schema.type = "object";
            
            $scope.recursiveBuildForm($scope.schema, $scope.TempForm, $scope.model);
            
            $scope.form = $scope.TempForm;
            
            $timeout(function () {
                $scope.$broadcast('schemaFormValidate');
            }, 200);
        })
    });
    
    
    
    
    $scope.fillFromApi = function (formFragment) {
        var res = $resource("/api/" + formFragment.lookup);
        res.get({}, function (data) {
            
            formFragment.titleMap = [];
            if (formFragment.type === "selectObj") {
                formFragment.titleMap = data.items;
            } else {
                
                if (formFragment.lookupNameFieldValue !== undefined) {
                    for (var i = 0; i < data.items.length; i++) {
                        
                        
                        formFragment.titleMap.push({ value: data.items[i][formFragment.lookupNameFieldValue], name: data.items[i][formFragment.lookupNameField] });
                    }
                }
                else {
                    for (var i = 0; i < data.items.length; i++) {
                        
                        
                        formFragment.titleMap.push({ value: data.items[i]._id, name: data.items[i][formFragment.lookupNameField] });
                    }
                }
               
            }
                    
        })
    }
    
    
    $scope.recursiveBuildForm = function (schema, form, model) {
        
        for (var key in schema.properties) {
            if (!schema.properties[key].edit)
                continue;
            

            var formFragment = schema.properties[key].form;
            if (formFragment === undefined)
                formFragment = {};
           // delete schema.properties[key].form;
            
            formFragment.schema = JSON.parse(JSON.stringify(schema.properties[key]));
            formFragment.schema.type = formFragment.schema.type.name;
            if (formFragment.schema.type === "date")
                formFragment.schema.type = "object";
            
            var propertiesToBeMerge = schema.properties[key].type;
            //schema.items = propertiesToBeMerge.items;
            
            for (var property in propertiesToBeMerge.schema) {
                
                if (formFragment[property] === undefined)
                    formFragment[property] = propertiesToBeMerge.schema[property];
            }
            formFragment.title = schema.properties[key].title;
            
            formFragment.type = formFragment.type.name;
            
            
            formFragment.key = key;
            if (formFragment.required)
                formFragment.feedback = "{ 'glyphicon': true, 'glyphicon-asterisk': form.required && !hasSuccess() && !hasError() ,'glyphicon-ok': hasSuccess(), 'glyphicon-remove': hasError() }";
            //else {
            //    formFragment.feedback = false;
            formFragment.disableSuccessState = true;
            // }
            
            
            //if (formFragment.nameField)
            //    $scope.nameFields.push(formFragment.key);
            if (formFragment.lookup !== undefined && formFragment.lookup !== "") {
                //load lookups
                
                $scope.fillFromApi(formFragment);
            }
            else {
                if (formFragment.enum !== undefined && formFragment.enum.length > 0) {
                    
                    var tempArr = _.map(formFragment.enum, function (item) {
                        return { name: item, value: item };
                    })
                    formFragment.titleMap = tempArr;
                }
            }
            
            
             
            if (schema.properties[key].items) {
                formFragment.items = [];
                $scope.recursiveBuildForm(schema.properties[key].items, formFragment.items)
            }
            
            
            form.push(formFragment);
        }

    }
    
    $scope.Saved = false;
    $scope.Dirty = false;
    $scope.SaveItem = function () {
        $scope.$broadcast('schemaFormValidate');
         
        if ($scope.ItemForm.$valid) {
            
            $scope.Saving = true;
            $scope.api.save($scope.model, function () {
                $scope.Saved = true;
                $scope.Saving = false;
                $timeout(function () {
                    $scope.Saved = false;
                }, 3000);
            });
        }
    }
    $scope.gridSaveItem = function () {
        var data = { _id: $scope.model._id };
	
    }    
    $scope.deleteItem = function () {
        $scope.message = "<p>Are you sure that you want to delete " + "<strong>" + fullNameFields($scope.nameFields) + "</strong> from the db?</p>";
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "partials/manage/dialogs/confirmDialog.html",
            scope: $scope,
        
        });
        
        modalInstance.result.then(function () {
            console.log("confirm");
            
            $scope.api.delete({ _id: $scope.model._id }, function () {
                console.log("Deleted");
            }, function () {
                console.log("delete error");
            });
        }, function () {
            console.log("cancel");
        });
        
        $scope.confirm = function () {
            
            modalInstance.close();
        };
        $scope.cancel = function () {
            modalInstance.dismiss();
        }
   
    };   
    

});




function fullNameFields(nameFields) {
    var str = "";
    for (var i = 0; i < nameFields.length; i++) {
        str += nameFields[i] + " ";
    }
    return str;
}
function dataSimplify(data, schema, modelData) {
    
    for (var i = 0; i < schema.length; i++) {
        
        if (schema[i].children > 0)
            dataSimplify(data[schema[i].name], schema[i].children, modelData);
        if (modelData[schema[i].name] !== undefined)
            data[schema[i].name] = modelData[schema[i].name].input;
    }
}
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};