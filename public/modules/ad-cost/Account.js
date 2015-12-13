

angular.module('ApiAdmin').controller('AccountController', ['$scope', '$Config', '$resource', '$location', '$compile', '$mdDialog', '$Theme', '$uibModal', function ($scope, $Config, $resource, $location, $compile, $mdDialog, $Theme, $uibModal) {
        
        $scope.$Theme = $Theme;
        $scope.FullSize = false;
        $scope.searchrequest = { name: "" };
        
        var keysArr = $scope.$parent.$parent.itemKey.split("_");
        $scope.itemId = keysArr[1];
        
        var websitesResource = $resource(apiUrl + "/adcost_accounts", {}, {
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

  

        $scope.facebookAuth = function () {
            $scope.InAuth = true;
            var redirect_uri = "http://localhost:3001/adcost/auth?a=" + $scope.EditObject._id;
            
            //$resource("/adcost/test").get(function (data) { 
            
            //    debugger;

            //});


            $scope.EditObject.ActiveAuthUrl = "https://www.facebook.com/dialog/oauth?client_id=203336776670339&redirect_uri=" + redirect_uri +"&scope=ads_management,ads_read";
            
            window.open($scope.EditObject.ActiveAuthUrl);
            return;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $modalInstance, items) { 
                    $scope.item = items;
                    $scope.ok = function () {
                        $modalInstance.close($scope.selected.item);
                    };
                    
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.EditObject;
                    }
                }
            });
            

  
           

        }




    }]);




