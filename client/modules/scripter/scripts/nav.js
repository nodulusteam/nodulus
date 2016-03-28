

angular.module('nodulus_scripter', ['ngMaterial', 'nodulus', 'ui.bootstrap'])
.directive("scripterNav", function ($compile, $mdDialog, $IDE) {
    return {
        restrict: 'E',
        controller: function ($scope, $resource, $Language) {
            var module = $scope.module;
            $scope.$Language = $Language;        
            $scope.menu = {
                id: module.module, 'name': "Scripter" , icon: 'fa fa-code', type: 'categories',
            }
            $scope.subTreeResource = $resource('scripter/navigation/', {});
            $scope.TreeLoading = true;
            $scope.subTreeResource.query({}, function (data) {

                $scope.menu.children = data;
                $scope.TreeLoading = false;
            });
            //$scope.ShowSelected = function (pagename) {
            //    debugger
            //    $IDE.ShowLobby({ "_id": pagename, "label": pagename }, "modules/cms/" + pagename + ".html");
            //}
            $scope.ShowSelected = function (node) {
                var itemUrl = node.Url;
                var item = { _id: node._id, name: node.Name };
                $IDE.ShowLobby(item, node.Url);
      
            }
           


            $scope.AddNew  = function () {
                $IDE.ShowLobby({ "_id": "scripter", "label": "scripter" }, "modules/scripter/modules.html");
            }
        },
        templateUrl: "modules/scripter/nav.html",
        link: function (scope, element, attrs) {
            
            //$compile(element.contents())(scope.$new);
             
        }
    };
});
