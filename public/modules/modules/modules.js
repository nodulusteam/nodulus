angular.module('ApiAdmin').controller("ModulesController", function ($scope, $Alerts, $IDE, $translate, $resource, $Language  ) {


    $scope.LoadAbout = function (pack) {
        var module = pack.module;
        $IDE.ShowLobby(module, "modules/" + module.name + "/" + module.about);
    }

    $scope.Install = function () {
        
        $scope.ModuleLoading = true;
        var setupRes = $resource("/modules/install");
        setupRes.save({ name: $scope.Module.Name }, function (data) {
            
            
            
            $scope.LoadAbout(data);
            
            $scope.ListModules();
            $TreeMenu.initTreeMenu();
            $Alerts.add({ type: 'success', msg: 'module: ' + $scope.Module.Name + ' installed', 'icon': 'fa fa-check' });
        }, function () {
            $Alerts.add({ type: 'danger', msg: 'module: ' + $scope.Module.Name + ' not installed', 'icon': 'fa fa-close' });
            $scope.ModuleLoading = false;
        })


    
    
    }
    $scope.Pack = function (module) {
        
        $scope.ModuleLoading = true;
        var setupRes = $resource("/modules/pack");
        setupRes.save({ name: module.name }, function (data) {
            $scope.ModuleLoading = false;
            $Alerts.add({ type: 'success', msg: 'module: ' + module.name + ' packed', 'icon': 'fa fa-check' });
        }, function () {
            $Alerts.add({ type: 'warning', msg: 'module: ' + $scope.Module.Name + ' not packed', 'icon': 'fa fa-close' });
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
                
                $Alerts.add({ type: 'success', msg: 'module: ' + $scope.Module.Name + ' removed', 'icon': 'fa fa-recycle' });
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