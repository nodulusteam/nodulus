

angular.module('ApiAdmin').controller('AccountsController', ['$scope', '$Config', '$resource', '$location', '$compile', '$mdDialog', '$Theme', function ($scope, $Config,$resource, $location, $compile, $mdDialog, $Theme) {

    $scope.$Theme = $Theme;

        $scope.searchrequest = { name: "" };
     
      
        
        

    var websitesResource = $resource(apiUrl + "/adcost_accounts", {  }, {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'query': { method: 'GET', isArray: true },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        });
    websitesResource.get({}, function (data) {
        $scope.Websites = data.items;
    });


    $scope.Open = function(item)
    {

            $Config.ready(function () { 
                window.open($Config.site.tunnel + item.AppRoot + item.PageUrl);
            })
        

        }
        
        $scope.Edit = function (rowItem, e) {
            //e.preventDefault();
            //var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
           
            var itemName = "";
            
          
            
            var _id = rowItem._id;
            var itemUrl = 'modules/ad-cost/Account.html';
            var item = { itemKey: "b_" + _id + "", name: rowItem.Name };
            angular.element("#view").scope().ShowLobby(item, itemUrl);
            return false;
        };

   

    $scope.dialog = function (callback) {
        $mdDialog.show({
            locals: { pscope: $scope },
                controller: ['$scope', '$Theme', 'pscope', function ($scope, $Theme, pscope) {
                      

                $scope.$Theme = $Theme;
                $scope.EditObject = pscope.EditObject;
                        


                $scope.Update = function () {
                    $scope.RequestActive = true;
                    websitesResource.update($scope.EditObject, function (data) {
                        $scope.RequestActive = false;
                        $mdDialog.hide();
                        if (callback !== undefined)
                            callback();
                    });
                };
                $scope.Cancel = function () {
                    $mdDialog.hide();
                };
            }],
            templateUrl: "websitedialog.html",
            onComplete: function () {
                //angular.element("#CategoryDialogScope").scope().LoadForParent(parent.Id);
            },
            //locals: { employee: $scope.userName }
        });

    }

    $scope.New = function () {
            
            var _id = generateUUID();
            var itemUrl = 'modules/ad-cost/account.html';
            var item = { itemKey: "b_" + _id + "", name: "new account" };
            angular.element("#view").scope().ShowLobby(item, itemUrl);
            return false;

     

         
    }


    $scope.Delete = function (item)
    {
        
        var confirm = $mdDialog.confirm()
      //.parent(angular.element(document.body))
      .title('Confirm')
       .content('This will delete website:' + item.Name + ', continue?')
      //.ariaLabel('Confirm')
       .ok('Continue')
      .cancel('Cancel');
      //.targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                 
            websitesResource.delete({ _id: item._id }, function (data) {
                 
                for (var i = 0; i < $scope.Websites.length; i++)
                    if ($scope.Websites[i] === item)
                        $scope.Websites.splice(i, 1);
                
            });

          
        }, function () {
           // $scope.alert = 'You decided to keep your debt.';
        });


       

    }




    }]);



function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};




