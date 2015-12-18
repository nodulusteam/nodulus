

angular.module('ApiAdmin').controller('LanguageController', ['$scope', '$Config', '$resource', '$location', '$compile', '$mdDialog', '$Theme', '$uibModal', function ($scope, $Config, $resource, $location, $compile, $mdDialog, $Theme, $uibModal) {
        
        $scope.$Theme = $Theme;
        $scope.FullSize = false;
        $scope.searchrequest = { name: "" };
        
        var keysArr = $scope.$parent.$parent.itemKey.split("_");
        $scope.itemId = keysArr[1];
        
        var websitesResource = $resource(apiUrl + "/Languages", {}, {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'query': { method: 'GET', isArray: true },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        });
        
        websitesResource.get({ _id: $scope.itemId }, function (data) {
            $scope.EditObject = data.items[0];
             
            if ($scope.EditObject === undefined) {
                
                $scope.EditObject = { _id: $scope.itemId };
            }

        
        });
        
        $scope.GoFullSize = function () {
            
            $scope.FullSize = !$scope.FullSize;
        }
        
        $scope.DeleteCookie = function (cookie) {
            $scope.EditObject.Cookies.splice($scope.EditObject.Cookies.indexOf(cookie));
        }
        $scope.AddCookie = function () {
            if ($scope.EditObject.Cookies === undefined || $scope.EditObject.Cookie === null)
                $scope.EditObject.Cookies = [];
            $scope.EditObject.Cookies.push({});
        
        }
        $scope.Open = function (item) {
            
            $Config.ready(function () {
                window.open($Config.site.tunnel + item.AppRoot + item.PageUrl);
            })
        

        }
        $scope.Edit = function (product) {
            
            $scope.EditObject = product;
            $scope.dialog();

        }
        $scope.remove = function (entry) {
            
            $scope.EditObject.values.splice($scope.EditObject.values.indexOf(entry),1) ;
             

        }
        $scope.add = function () {            
            $scope.EditObject.values.push({});
        }
        

        $scope.Update = function () {
            $scope.Saving = true;
            $scope.RequestActive = true;
            
            websitesResource.save($scope.EditObject, function (data) {
                $scope.RequestActive = false;
                $scope.Saving = false;
              
            });
        };

  

      




    }]);




