

angular.module('ApiAdmin').controller('WebsiteController', ['$scope', '$Config', '$resource', '$location', '$compile', '$mdDialog', '$Theme', function ($scope, $Config, $resource, $location, $compile, $mdDialog, $Theme) {
        
        $scope.$Theme = $Theme;
        $scope.FullSize = false;
        $scope.searchrequest = { name: "" };
        
        $scope.HostingScripts = [{ src: 'loadspeed.js', name: 'loadspeed' }, { src: 'arguments.js', name: 'arguments' }, { src: 'inject.js', name: 'inject' }, { src: 'index.js', name: 'default' }];
        $scope.ContentTypes = [{ id: "text/html", name: "text/html" }, { id: "application/json", name: "application/json" }, { id: "text/xml", name: "text/xml" }];
        var keysArr = $scope.$parent.$parent.itemKey.split("_");
        $scope.itemId = keysArr[1];
        
        var websitesResource = $resource(apiUrl + "/Websites", {}, {
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
        $scope.Update = function () {
            $scope.Saving = true;
            $scope.RequestActive = true;
            
            websitesResource.save($scope.EditObject, function (data) {
                $scope.RequestActive = false;
                $scope.Saving = false;
              
            });
        };

  

   




    }]);




