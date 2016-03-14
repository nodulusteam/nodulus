

angular.module('nodulus_cms', ['ngMaterial','nodulus'])
.directive("cmsNav", function ($compile, $mdDialog, $IDE) {
    return {
        restrict: 'E',
        controller: function ($scope, $resource, $mdDialog, $mdBottomSheet) {
            
            
            $scope.menu = {
                id: 1, 'name': "Categories" , icon: 'fa fa-folder-open', type: 'categories',
                navname: "cms-nav", 
                showTreeBottomSheet: function ($event, node) {
                    
                    
                    
                    $mdBottomSheet.show({
                        templateUrl: 'modules/cms/TreeMenu.html',
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
            $scope.subTreeResource = $resource(apiUrl + '/Navigation/', { ParentId: "@parentid" });
        

            $scope.TreeLoading = true;
            $scope.subTreeResource.get({ ParentId: '00000000-0000-0000-0000-000000000000' }, function (data) {
                
                
                
                for (var i = 0; i < data.items.length; i++) {
                    
                    if (data.items[i].Left + 1 < data.items[i].Right)
                        data.items[i].Children = {};
                }
                
                
                $scope.menu.children = data.items;
                $scope.TreeLoading = false;
            });


            $scope.Load = function(pagename)
            {
                $IDE.ShowLobby({ "_id": pagename, "label": pagename }, "modules/cms/" + pagename +".html");
            }
        },
        templateUrl: "modules/cms/nav.html",
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