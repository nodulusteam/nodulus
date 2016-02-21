/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
 


angular.module('nodulus')
.controller("zipemController", function ($scope, $Alerts, $IDE, $translate, $resource, $Language, uibDateParser) {
    
    //$scope.ProjectPath = "C:\\ewaveprojects\\Megalim\\Dev\\Site.Elements\\eGen.Site";
    
    $scope.dt = new Date();
    $scope.browseFolder = function (path) { 
    
        var folders = $resource("zipem/folderpath");
         
        folders.query({ path: path, date: $scope.dt },  function (data) {
            $scope.FolderFileList = data;
             
        })
    
    }
    $scope.zipit = function (path) {
        
        var ziper = $resource("zipem/zipit");
        
        ziper.query({ path: $scope.ProjectPath, date: $scope.dt }, function (data) {
            
             
        })
    

    }


    $scope.getFolders = function (val) {
        var folders = $resource("zipem/getFolders");

        return folders.query({ "term": val }).$promise.then(function (response) {
           // alert(JSON.stringify(response));

           if(response.length > 0)
                return response.map(function (item) {
                   
                    return item.name;
                });
        });
    };

})