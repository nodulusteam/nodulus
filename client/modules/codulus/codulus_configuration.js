/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
 


angular.module('nodulus').controller("codulusConfigurationController", 
    function ($scope, $Alerts, $IDE, $translate, $resource, $Language) {
    $scope.configrationOptions = {};
    var conf = localStorage.getItem("codulus_configuration");
    if (conf)
        $scope.configrationOptions = JSON.parse(conf);

    $scope.aceThemes = ["ambiance", "cloud"];
    $scope.$watch("configrationOptions", function (newValue, oldValue) {
        
         
        if (newValue) {
            localStorage.setItem("codulus_configuration", JSON.stringify(newValue));
            $scope.$emit("codulus_configuration_changed");

        }
                
    
    
    },true);
    
    
})