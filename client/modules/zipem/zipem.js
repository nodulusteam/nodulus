/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
 


angular.module('nodulus')
.controller("zipemController", function ($scope, $Alerts, $IDE, $translate, $resource, $Language, uibDateParser) {
    
    //$scope.ProjectPath = "C:\\ewaveprojects\\Megalim\\Dev\\Site.Elements\\eGen.Site";
    
    $scope.dt = new Date();

    var persisted = localStorage.getItem("zipem");
    if (persisted) {
         
        persisted = JSON.parse(persisted);
        
        $scope.dt = new Date( persisted.date);
        $scope.ProjectPath = persisted.path;
        $scope.ExcludeList = persisted.exclude;

    }

     
    

   
    $scope.browseFolder = function (path) { 
    
        var folders = $resource("zipem/folderpath");
         
        folders.query({ path: $scope.ProjectPath, date: $scope.dt },  function (data) {
            $scope.FolderFileList = data;
             
        })
    
    }
    $scope.zipit = function (path) {
        
        alert($scope.ProjectPath);
        var persisted = { path: $scope.ProjectPath, date: $scope.dt, exclude: $scope.ExcludeList };

        localStorage.setItem("zipem", JSON.stringify(persisted));

        var ziper = $resource("zipem/zipit");
        
        ziper.get(persisted, function (data) {
            data.filename = data.filename.replace(/\//g, '\\');
            $Alerts.add({ type: 'success', msg: "<a target='_blank' href='" + data.filename  +"'>click to open</a>", 'icon': 'fa fa-check' });             
             
             
        })
    

    }


    $scope.getFolders = function (val) {
        var folders = $resource("zipem/getFolders");

        return folders.query({ "term": val }).$promise.then(function (response) {
            

           if(response.length > 0)
                return response.map(function (item) {
                   
                    return item.name;
                });
        });
    };

})