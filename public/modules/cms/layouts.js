angular.module('nodulus').controller("cms_layouts", function ($scope, $Alerts, $IDE, $translate, $resource, $Language, $mdDialog) {
    
    
    var layoutsRes = $resource("api/cms_layouts");
    layoutsRes.get({}, function (data) {
        
        $scope.Layouts = data.items;
    });
    
    $scope.AddPageControl = function (array) {
        
        var parentEl = angular.element(document.body);
        
        
        
        $mdDialog.show({
            parent: parentEl,
            templateUrl: 'modules/cms/pagecontrolsdialog.html',
            controller: 'PageControlsDialog',
            //locals: { "$EditCategory": { _id: guid(), ParentId: '00000000-0000-0000-0000-000000000000' }, "$NodeCollection": menu.children },
            onComplete: function () { }
        });

       
    
    }
    $scope.Edit = function (layout) { 
    
        $scope.Layout = layout;
    }
    $scope.New = function () {
        
        $scope.Layout = {
            _id: guid(),
            filename: "main.html",
            placeholders: {
                "top": [] , "center": [], "right": []
            }
            
            
            
        }
    
    }
    
    $scope.Save = function () {
        
        layoutsRes.save($scope.Layout, function (data) { 
        
        
        })
    
    }

})