

angular.module('nodulus_codulus', ['ngMaterial','nodulus'])
.directive("codulusNav", function ($compile, $mdDialog, $IDE) {
    return {
        restrict: 'E',
        controller: function ($scope,   $resource, $mdDialog, $mdBottomSheet,$Language) {
            $scope.$Language = $Language;
            $scope.PaneHeight = $(window).height() - 100;
            $scope.menu = {
                collapsed: true,
                id: 1, 'name': "Files" , icon: 'fa fa-sitemap', type: 'folders',
                navname: "codulus-nav", 
                showTreeBottomSheet: function ($event, node) {
                    
                    
                    
                    $mdBottomSheet.show({
                        templateUrl: 'modules/codulus/TreeMenu.html',
                        controller: 'TreeMenuCtrl',
                        targetEvent: $event
                    }).then(function (clickedItem) {
                        
                        clickedItem.method($event);
            //$scope.alert = clickedItem.name + ' clicked!';
                    });
                },
                AddCategory: function (menu) {
                    
                    
                    var parentEl = angular.element(document.body);
                    
                    
                    
                    $mdDialog.show({
                        parent: parentEl,
                        templateUrl: 'partials/manage/dialogs/category.html',
                        controller: 'CategoryDialog',
                        locals: { "$EditCategory": { _id: guid(), ParentId: '00000000-0000-0000-0000-000000000000' }, "$NodeCollection": menu.children },
                        onComplete: function () { }
                    });

                }
            }
            $scope.subTreeResource = $resource('codulus/folders', { ParentId: "@parentid" });
        

            $scope.TreeLoading = true;
            $scope.subTreeResource.get({ path: '\\' }, function (data) {
                
                var finalOrder = [];
                var filesOrder = [];
                
                for (var i = 0; i < data.items.length; i++) {
                    data.items[i].file_path = data.items[i]._id;
                    data.items[i]._id = data.items[i]._id.replace(/:/g, '_').replace(/\\/g, '_').replace(/\./g, '_');
                    console.log(data.items[i]._id);

                    if (data.items[i].nodetype === "folder") {
                        data.items[i].Children = {};
                        data.items[i].tree_icon = 'fa fa-folder';
                        data.items[i].noLeaf = true;
                        data.items[i].expanded = false;
                        data.items[i].isDirectory = true;
                        finalOrder.push(data.items[i]);
                    }
                    else {
                        data.items[i].tree_icon = 'fa fa-file';
                        filesOrder.push(data.items[i]);
                    }
                }
                
                
                 
                $scope.menu.children = finalOrder.concat(filesOrder);
                $scope.TreeLoading = false;
            });

            
            //$scope.showSelected = function (node) {
            //    var itemUrl = 'lobby.html';
            //    var item = { _id: node._id, name: node.Name, schemaid: node._id };
            //    $IDE.ShowLobby(item, node.Url);
      
            //}
            
            
            $scope.loadSelected = function (node, menu) {

                $scope.subTreeResource.get({ path: node.path }, function (data) {
                    
                    var finalOrder = [];
                    var filesOrder = [];
                     
                    for (var i = 0; i < data.items.length; i++) {
                        data.items[i].file_path = data.items[i]._id;
                        data.items[i]._id = data.items[i]._id.replace(/:/g, '_').replace(/\\/g, '_').replace(/\./g, '_');
                        console.log(data.items[i]._id);
                        
                        if (data.items[i].nodetype === "folder") {
                            data.items[i].Children = {};
                            data.items[i].tree_icon = 'fa fa-folder';
                            data.items[i].noLeaf = true;
                            data.items[i].expanded = false;
                            data.items[i].isDirectory = true;
                            finalOrder.push(data.items[i]);
                        }
                        else {
                            data.items[i].tree_icon = 'fa fa-file';
                            filesOrder.push(data.items[i]);
                        }
                    }
                    
                    
                    node.children = finalOrder.concat(filesOrder);;
                   
                    menu.expand_branch(node);
                    $scope.TreeLoading = false;
                });
            }

            $scope.showSelected = function(node)
            {
                if(!node.isDirectory)
                        $IDE.ShowLobby(node, "modules/codulus/codulus.html");
            }
        },
        templateUrl: "modules/codulus/nav.html",
        link: function (scope, element, attrs) {
            
            //$compile(element.contents())(scope.$new);
             
        }
    };
})
.controller('TreeMenuCtrl', function ($scope, $mdBottomSheet, $mdDialog, $resource, $rootScope, $IDE) {
    
    $scope.items = [
        //{ name: 'Add child category', icon: 'add', method: AddCategory },
        { name: 'Edit Category', icon: 'fa fa-cog', method: EditCategory },
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
        var url = 'Schemas.html';
        var scope = angular.element("#view").scope();
        item.node.schemaid = item.node._id;
        item.node.itemKey = "schema_" + item.node._id;
        item.node.name = item.node.label;
        $IDE.ShowLobby(item.node, url);
    }
    function DeleteCategory(category) {
        
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