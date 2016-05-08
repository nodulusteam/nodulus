/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
 


angular.module('nodulus').controller("codulusController", 
    function ($scope, $Alerts, $IDE, $translate, $resource, $Language, $rootScope, hotkeys) {
    $scope.PaneHeight = $(window).height() - 100;
    $scope.tabIdentifier = $scope.$parent.$parent.itemKey;
    var firstFlag = true;

    var fileObject = $IDE.TabsObject[$scope.tabIdentifier];
    $scope.editorInstance = null;
    
    var configuration = localStorage.getItem("codulus_configuration");
    if (configuration)
        configuration = JSON.parse(configuration);

    $rootScope.$on("codulus_configuration_changed", function () {
        
        var configuration = localStorage.getItem("codulus_configuration");
        if (configuration)
            configuration = JSON.parse(configuration);
        $scope.editorInstance.setTheme(configuration.theme);

       
    
    });
    
    $scope.setEditor = function () { 
        
    
    }

    
    $scope.aceOptions = {
        require: ['ace/ext/language_tools'],
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        },
        useWrapMode : true,
        showGutter: true,
        theme: configuration.theme,        
        onLoad : function (_editor) {
            
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;
            $scope.editorInstance = _editor;
            
            $scope.editorInstance.commands.addCommand({
                name: 'saveFile',
                bindKey: {
                    win: 'Ctrl-S',
                    mac: 'Command-S',
                    sender: 'editor|cli'
                },
                exec: $scope.SaveItem
            });

            if (fileObject.file_path.indexOf('.') > -1) {
                var ext = fileObject.file_path.split('.')[1];
                var mode = "javascript";
                switch (ext) {
                    case "js":
                        mode = "javascript";
                        break;
                    case "json":
                        mode = "json";
                        break;

                }
                
                
                // Options
                $scope.editorInstance.getSession().setMode("ace/mode/" + mode);
                $scope.editorInstance.setTheme(configuration.theme);
                
                $scope.aceOptions.mode = mode;
                $IDE.clearDirty($scope.tabIdentifier);
            }
        },
        onChange: function () {
            if (!firstFlag) {
                $scope.EditFile.dirty = true;
                $IDE.setDirty($scope.tabIdentifier);

            }
            firstFlag = false;
        
        }
 
    }
     
    $resource('codulus/openfile').get({ 'file_path': fileObject.file_path }, function (data) {
     
        
    
        $scope.EditFile = data;
        $scope.EditFile.dirty = false;
        $IDE.clearDirty($scope.tabIdentifier);
    });


    $scope.SaveItem = function () {
        $resource('codulus/savefile').save($scope.EditFile, function (data) { 
            $scope.EditFile.dirty = false;
            $IDE.clearDirty($scope.tabIdentifier);
        });
    
    }

     
    hotkeys.bindTo($scope)
    .add({
        combo: 'ctrl+s',
        description: 'save document',
        callback: $scope.SaveItem
    });
   


})