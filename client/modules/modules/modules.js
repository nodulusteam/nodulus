/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
 

angular.module('nodulus').controller("ModulesController", function ($http, $scope, $Alerts, $IDE, $translate, $resource, $Language , $mdDialog, $TreeMenu) {
    
  


    $scope.LoadAbout = function (pack) {
         
        var module = pack.module;
        $IDE.ShowLobby({"label": module.name, _id: module.name +"_about"}, "modules/" + module.name + "/about.html");
    }
    
    
    $scope.Configure = function (pack) {
        
        var module = pack.module;
        $IDE.ShowLobby({ "label": module.name, _id: module.name + "_configuration" , configModule: pack }, "modules/"+ module.name+"/" + module.name +"_configuration.html");
    }

    $scope.getModules = function (str)
    {
        
         return $http.get("/modules/listsearch?name=" + escape(str)).then(function (response) {
            return response.data;
        });
        //return searchResource.get({ "name": str }, function (data) {
             

        //    return data;
        //})
        ////searchResource.query({ "name": str }).then(function (response) {
        ////    alert(response);
        ////    return response;
        ////});;
    }
    $scope.Install = function () {
        
        $scope.ModuleLoading = true;
        var setupRes = $resource("/modules/install");
        setupRes.save({ name: $scope.Module.Name }, function (data) {
            
            
            
            $scope.LoadAbout(data);
            
            $scope.ListModules();
            $TreeMenu.initTreeMenu();
            $Alerts.add({ type: 'success', msg: 'module: ' + $scope.Module.Name + ' installed', 'icon': 'fa fa-check', autoClose: 1000 * 5 });
        }, function () {
            $Alerts.add({ type: 'danger', msg: 'module: ' + $scope.Module.Name + ' not installed', 'icon': 'fa fa-close', autoClose: 1000 * 5 });
            $scope.ModuleLoading = false;
        })


    
    
    }
    
    $scope.Create = function () {
        
        $scope.ModuleLoading = true;
        var createRes = $resource("/modules/create");
        createRes.save({ name: $scope.Module.NewName }, function (data) {
            
            
            var setupRes = $resource("/modules/install");
            setupRes.save({ name: $scope.Module.NewName }, function (data) {
                  $Alerts.add({ type: 'success', msg: 'module: ' + $scope.Module.NewName + ' installed', 'icon': 'fa fa-check', autoClose: 1000 * 5 });
                  
                    $scope.LoadAbout(data);            
                    $scope.ListModules();
                    $TreeMenu.initTreeMenu();
                
            });
            
       
          
        }, function () {
            $Alerts.add({ type: 'danger', msg: 'module: ' + $scope.Module.Name + ' not installed', 'icon': 'fa fa-close' , autoClose: 1000 * 5});
            $scope.ModuleLoading = false;
        })


    
    
    }
    

    $scope.Pack = function (module) {
        
        $scope.ModuleLoading = true;
        var setupRes = $resource("/modules/pack");
        setupRes.save({ name: module.name }, function (data) {
            $scope.ModuleLoading = false;
            $Alerts.add({ type: 'success', msg: 'module: ' + module.name + ' packed', 'icon': 'fa fa-check' , autoClose: 1000 * 5});
        }, function () {
            $Alerts.add({ type: 'warning', msg: 'module: ' + $scope.Module.Name + ' not packed', 'icon': 'fa fa-close', autoClose: 1000 * 5 });
            $scope.ModuleLoading = false;
        
        })


    
    
    }
    
    $scope.ModuleLoading = false;
    $scope.UnInstall = function (module) {
        
        var confirm = $mdDialog.confirm()
      //.parent(angular.element(document.body))
      .title('Confirm')
       .content('This will uninstall module:' + module.name + ', continue?')
      //.ariaLabel('Confirm')
       .ok('Continue')
      .cancel('Cancel');
        //.targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
            $scope.ModuleLoading = true;
            
            var setupRes = $resource("/modules/uninstall");
            setupRes.save({ "name": module.name }, function (data) {
                 
                $Alerts.add({ type: 'success', msg: 'module: ' + module.name + ' removed', 'icon': 'fa fa-recycle' , autoClose: 1000 * 5});
                $scope.ListModules();
                $TreeMenu.initTreeMenu();
            })

          
        }, function () {
           // $scope.alert = 'You decided to keep your debt.';
        });
        

       
    }
    
    $scope.ListModules = function () {
        
        $scope.ModuleList = [];
        $scope.ModuleLoading = true;
        var setupRes = $resource("/modules/list");
        setupRes.query({}, function (data) {
            $scope.ModuleLoading = false;
            $scope.ModuleList = data;
           
        })


    
    
    }
    
    $scope.ListModules();
})