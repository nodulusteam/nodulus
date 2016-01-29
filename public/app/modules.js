/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
 
"use strict";
var loader_count = 0;

 



var nodulus_dependecies = ['infinite-scroll', 'ngCkeditor', 'anguFixedHeaderTable', 'm43nu.auto-height',
    'mgcrea.ngStrap', 'mj.scrollingTabs', 'ui.bootstrap', 'ui.ace', 'ngSanitize', 'ngRoute', 'ngResource', 'angular.filter', 'angularBootstrapNavTree',
    'treeControl', 'ngMaterial', 'ngMessages', 'RecursionHelper', 'DynamicDataSerivces', 'Cache', 'IDE', 'pascalprecht.translate'];

var delay_bootstraping = false;

for (var module_name in nodulus_mapping) {
  var module = nodulus_mapping[module_name];
    for (var i = 0; i < module.scripts.length; i++) {
        delay_bootstraping = true;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = false;
    script.src = "modules/" + module_name + "/scripts/" + module.scripts[i];
    script.onload = function () {
      loader_count--;     
      if(loader_count == 0)
      {
        angular.element(document).ready(function () {
          
          angular.bootstrap(document, ['nodulus']);
        });
      }
    }
    document.getElementsByTagName('head')[0].appendChild(script);
    loader_count++;
  }
  for (var i = 0; i < module.dependencies.length; i++) {
    nodulus_dependecies.push(module.dependencies[i]);
  }

  


}

    if (!delay_bootstraping) {
        angular.element(document).ready(function () {      
              
            angular.bootstrap(document, ['nodulus']);
        });
    }