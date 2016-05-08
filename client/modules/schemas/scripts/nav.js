/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | �Roi ben haim  �2016    
 */




angular.module('nodulus_schemas', ['ngMaterial'])
.directive("schemasNav", function ($compile, $mdBottomSheet, $mdDialog, $IDE, $Language) {
    return {
        restrict: 'E',
        controller: function ($scope, $resource, $Language) {
            $scope.$Language = $Language;

            $scope.menu = {
                id: 2, 'name': 'Data',
                icon: 'fa fa-database' , 
                'type': 'schemas',
                
                showTreeBottomSheet: function ($event, node) {
                    $mdBottomSheet.show({
                        templateUrl: 'modules/schemas/SchemaTreeMenu.html',
                        controller: 'SchemaTreeMenuCtrl',
                        targetEvent: $event
                    }).then(function (clickedItem) {
                        clickedItem.method($event);
                    });
                },
                AddCategory: function (menu) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                        parent: parentEl,
                        templateUrl: 'modules/schemas/schemaDialog.html',
                        controller: 'SchemaDialog',
                        locals: { "$EditCategory": { ParentId: '00000000-0000-0000-0000-000000000000' }, "$NodeCollection": menu.children },
                        onComplete: function () { }
                    });

                }
            }
            
            
            $scope.RefreshMenu = function () { 
                $scope.schemaTreeResource = $resource(apiUrl + '/schemas/', {$sort: { "name": 1 }});
                
                $scope.TreeLoading = true;
                $scope.schemaTreeResource.get({}, function (data) {
                    $scope.menu.children = [];
                    for (var i = 0; i < data.items.length; i++) {
                        $scope.menu.children.push({
                            Alias: data.items[i].name ,
                            Name: data.items[i].name ,
                            ParentId: "00000000-0000-0000-0000-000000000000",
                            Url: "/modules/schemas/lobby.html",
                            _id: data.items[i]._id,
                            label: data.items[i].name
                        });

                                 
                    }
                    
                    
                    
                    $scope.menu.TreeLoading = false;
                });
            
            }

            $scope.RefreshMenu();
            $scope.$on("updateMenus", function () {
                
                $scope.RefreshMenu();
            })

            
            $scope.showSelected = function (node) {                
                var item = { _id: node._id, name: node.Name, schemaid: node._id };
                $IDE.ShowLobby(item, node.Url);
      
            }


        },
        templateUrl: "modules/schemas/nav.html",
        link: function (scope, element, attrs) {
            
            
            //$compile(element.contents())(scope.$new);
             
        }
    };
}        
).controller('SchemaTreeMenuCtrl', function ($scope, $mdBottomSheet, $mdDialog, $resource, $rootScope, $IDE) {
    
  
    $scope.items = [
        //{ name: 'Add child category', icon: 'add', method: AddCategory },
        //{ name: 'Edit Collection', icon: 'fa fa-cog', method: EditCategory },
        { name: 'Remove', icon: 'fa fa-close' , method: DeleteCategory },
        { name: 'Edit Schema', icon: 'fa fa-edit', method: EditSchema }
    ];
    
    
    function AddCategory(parent) {
        
        
        $mdDialog.show({
            template: "<div data-any-lobby=\"" + "/dialogs/category.html" + "\" flex='80'></div>",
            
            //templateUrl: 'partials/dialogs/category.html',
            //controller: 'GreetingController'
            onComplete: function () {
                
                
                angular.element("#CategoryDialogScope").scope().LoadForParent(parent.Id);
            },
            //locals: { employee: $scope.userName }
        });

    }
    
    function EditSchema(item) {
        var url = 'modules/schemas/schemas.html';
        item.node.schemaid = item.node._id;
        item.node.itemKey = "schema_" + item.node._id;
        $IDE.ShowLobby(item.node, url);
    }
    
    function DeleteCategory(category) {
         
        var confirm = $mdDialog.confirm()
      //.parent(angular.element(document.body))
      .title('Confirm')
       .content('This will delete schema:' + category.node.Name + ', continue?')
      //.ariaLabel('Confirm')
       .ok('Continue')
      .cancel('Cancel');
        //.targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            
            
            var lobbyResource = $resource(apiUrl + '/schemas/', {}, {
                'get': { method: 'GET' },
                'save': { method: 'POST' },
                'query': { method: 'GET', isArray: true },
                'update': { method: 'PUT' },
                'delete': { method: 'DELETE' }
            });
            
            
            lobbyResource.delete({ "_id": category.node._id }, function (data) {
                $rootScope.$broadcast("updateMenus");


            })


        });
    }
    
    function EditCategory(category) {
        
        
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            templateUrl: 'partials/manage/dialogs/category.html',
            controller: 'CategoryDialog',
            locals: { "$EditCategory": category },
            
            //templateUrl: 'partials/dialogs/category.html',
            //controller: 'GreetingController'
            onComplete: function () {
               // alert("complete");
                
                //angular.element("#CategoryDialogScope").scope().LoadForParent(0);
            },
            //locals: { employee: $scope.userName }
        });
        

        //$mdDialog.show({
        //    template: "<div data-any-lobby=\"" + "/dialogs/category.html" + "\" flex='80'></div>",
        //    //templateUrl: 'partials/dialogs/category.html',
        //    //controller: 'GreetingController'
        //    onComplete: function () {

        //        angular.element("#CategoryDialogScope").scope().LoadData(category.Id);
        //    },
        //    //locals: { employee: $scope.userName }
        //});

    }
    
    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
})
.controller('SchemaDialog', function ($scope, $resource, $location, $compile, $mdDialog, $Theme, $Config, $EditCategory, $rootScope, $Cache) {
    
    
    $scope.EditCategory = $EditCategory;
    $scope.$Theme = $Theme;
    //$DataTable.Load();
    //$scope.DataTables = $DataTable.Tables;
    //$scope.DataTablesDic = $DataTable.TablesDic;
    $scope.RequestActive = false;
    //.success(function (data) {
    
    //    $scope.DataTables = data.Table;
    //})
    
    
    
    $scope.EditCategory = { type: "object", "required": [], "properties": {} }
    //$scope.EditCategory["schema"] = { fields: [] };
    
    $scope.GetTable = function (id) {
        
        return $scope.DataTablesDic[id];
    }
    
    //var header = { 'token': $User.User.Token, "patientid": $User.User._id };
    
    var lobbyResource = $resource(apiUrl + '/schemas/', {}, {
        'get': { method: 'GET' },
        'save': { method: 'POST' },
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' },
        'delete': { method: 'DELETE' }
    });
    
    
    
    var nameResource = $resource('/schemas/collections', {}, {
        'get': { method: 'GET' },
        'save': { method: 'POST' },
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' },
        'delete': { method: 'DELETE' }
    });
    nameResource.query({}, function (data) {
        $Cache.ready("schemas", function (schemas) {
            
            var result = [];
            for (var i = 0; i < data.length; i++) {
                for (var x = 0; x < schemas.length; x++) {
                    if (schemas[x].name === data[i].name) {
                        
                        data.splice(i, 1);
                        i = 0;
                    }
                }
            }
            
            if (data.length > 0)
                $scope.NamingMode = "existing";
            
            $scope.NotMappedSchemas = data;
        });
    });
    
    
    $scope.ParentCategory = null;
    $scope.LoadData = function (boneid) {
        $scope.RequestActive = true;
        lobbyResource.get({ boneid: boneid }, function (data) {
            $scope.EditCategory = data;
        });
    }
    
    //$scope.RefreshMenu();
    $scope.LoadForParent = function (parentid) {
        $scope.RequestActive = true;
        lobbyResource.get({ boneid: parentid }, function (data) {
            $scope.RequestActive = false;
            $scope.Results = data.d;
        });
    }
    
    $scope.Update = function () {
        
        $scope.RequestActive = true;
        if ($scope.EditCategory._id !== undefined) {
            lobbyResource.update($scope.EditCategory, function (data) {
                $scope.RequestActive = false;
                $mdDialog.hide();
                $rootScope.$broadcast("updateMenus");
            });
        }
        else {
            $scope.EditCategory._id = guid();
            lobbyResource.save($scope.EditCategory, function (data) {
                $scope.RequestActive = false;
                $mdDialog.hide();
                $rootScope.$broadcast("updateMenus");
            });
        }
    };
    $scope.Cancel = function () {
        $mdDialog.hide();
    };
    
   


})



