/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  
 
 
var LNG = new function () {
    
    this["OK"] = "OK";
    this["CANCEL"] = "CANCEL";
    this["CONFIRMATION"] = "CONFIRMATION";
    this["Project settings"] = "Project settings";
    this["ConfirmProjectDelete"] = "are you sure you wish to delete the project?";
    this["ConfirmFileDelete"] = "are you sure you wish to delete the file?";
    
    this["ConfirmBlockDelete"] = "are you sure you wish to delete this block?";
    this["ConfirmMacroDelete"] = "are you sure you wish to delete the macro?";
    this["ConfirmFileDelete"] = "are you sure you wish to delete the file?";
    this["ConfirmRuleRemove"] = "are you sure you wish to remove this rule?";
    
    
    
    
    this["Unknown"] = "Unknown";
    
    this["ProjectFiles"] = "Project files";
    this["MacroDetails"] = "Macro details";
    this["ScriptLoadRules"] = "Script load rules";
    this["NewMacro"] = "New macro";
    
    this["MacroEditor"] = "Macro editor";
    this["BlockGallery"] = "Block gallery";
    this["PaymentInformation"] = "Payment information";
    this["Rules"] = "Rules";
    this["Share"] = "Share";
    this["Macros"] = "Macros";
    
    
    this["SelectElement"] = "Select Element";
    this["ElementBrowser"] = "Element browser";
    this["EditRule"] = "Edit rule";
    this["NewRule"] = "New rule";
    this["Share editor"] = "Share editor";
    this["EXPORT"] = "Export";
        

         
}

angular.module('nodulus')
.controller("scripterController", function ($scope, $Alerts, $IDE, $translate, $resource, $Language) {

     
})
.controller('projectsController', ['$scope', '$http', '$filter', '$Alerts', '$IDE', '$translate', '$resource', '$Language', function ($scope, $http, $filter, $Alerts, $IDE, $translate, $resource, $Language) {
        ///data scope
        var orderBy = $filter('orderBy');
        
        var resource = $resource("api/scripter_projects");
        resource.get({}, function (data) {
            
            $scope.Projects = data.items;
            for (var i = 0; i < $scope.Projects.length; i++)
                $scope.Projects[i].ProjectMeta = angular.fromJson($scope.Projects[i].ProjectMeta)
        })
        
        
        
        $scope.Project = null;
        $scope.File = null;
        
        
        ///projects
        $scope.NewProject = function () { };
        $scope.SetProject = function (project) {
            window["GlobalProject"] = project;
            $scope.Project = project;
            $("#FieldDropDown").removeClass("hidden");
            $("#BlockDropDown").addClass("hidden");
            $scope.File = null;
            $scope.Block = null;
        }
        $scope.RunProject = function (project) {
            window.open("../SiteRun.aspx?scripterid=" + $(this).attr("rel") + "&url=" + escape(project.Url));
        }
        $scope.DeleteProject = function (project) {
            BootstrapDialog.confirm(LNG.ConfirmProjectDelete, function (result, dialog) {
                if (result) {
                    
                    $http({ method: 'POST', url: "handlers/Save.aspx/DeleteSite", data: { "projectId": project._id } }).
    success(function (data, status, headers, config) {
                        
                        for (var i = 0; i < $scope.Projects.length; i++) {
                            
                            if ($scope.Projects[i]._id == project._id) {
                                $scope.Projects.splice(i, 1);
                                break;
                            }
                        }
                        $scope.$apply($scope.Projects);
                        dialog.close();

                    }).
error(function (data, status, headers, config) {
                        
                        alert(data.Message);
                    });
 
                }
            });
        }
        $scope.EditProject = function (project) {
            $scope.Project = project;
            $scope.CreateSiteDialog();
        }
        $scope.CreateSiteDialog = function () {
            $("#SiteDialog").show();
            var siteDialog = BootstrapDialog.show({
                type: BootstrapDialog.TYPE_PRIMARY,
                title: getIcon("cog") + LNG["Project settings"],
                message: $("#SiteDialog"),
                buttons: [{
                        label: LNG.OK,
                        action: function (dialog) {
                            var btn = this;
                            
                            if (!$scope.ProjectInformationForm.$valid) {
                                $(btn).find('.fa').remove();
                                return;
                            }
                            
                            
                            var isnew = ($scope.Project._id === undefined);
                            if ($scope.Project._id === undefined)
                                $scope.Project._id = guid();
                            
                            var params = {
                                "_id": $scope.Project._id, 
                                "Name": $scope.Project.Name,
                                "Url": $scope.Project.Url, 
                                "ProjectMeta": $scope.Project.ProjectMeta
                            };
                            
                            
                            
                            $http({ method: 'POST', url: "scripter/project", data: { project: params } }).
                            success(function (data, status, headers, config) {
                                
                                
                                
                                if (isnew) {
                                    $scope.Projects.push(data);
                                }
                                
                                
                                $scope.Project = data;
                                
                                $(btn).find('.fa').remove();
                                dialog.close();
                            }).
                                                        error(function (data, status, headers, config) {
                                
                                alert(data.Message);
                            });
                            
                            
                            //$.ajax({
                            //    type: "POST",
                            //    url: "handlers/SaveSite.ashx",
                            //    data: params,
                            //    dataType: "json",
                            //    async: true,
                            //    complete: function (data, textStatus, jqXHR) {
                            
                            //    }
                            //});
                            
                            
                               
                        }

                    }
            , {
                        label: LNG.EXPORT,
                        action: function (dialog) {
                            var btn = this;
                            
                            $(btn).addClass("btn-success");
                            setTimeout(function () {
                                $(btn).find('.fa').remove();
                                $(btn).removeClass("btn-success");
                            }, 2000);
                            document.location.href = "handlers/ExportSite.ashx?siteid=" + $scope.Project._id + "&approot=" + $scope.Project.AppRoot;

                        }
                    }
                ]
            });

        }
        
        
        ///files
        $scope.SetFile = function (file) {
            
            $scope.File = file;
            $scope.Block = null;
            $("#BlockDropDown").removeClass("hidden");
        }
        $scope.NewFile = function (newguid) {
            $IDE.ShowLobby({ "_id": newguid, "label": "new file" }, "modules/scripter/pipeline.html");
            //var url = "Pipeline.aspx?SiteId=" + $scope.Project._id + "&id=" + newguid;
            //document.location.href = url;
        }
        $scope.DeleteFile = function (file) {
            BootstrapDialog.confirm(LNG.ConfirmFileDelete, function (result, dialog) {
                if (!result)
                    return;
                
                
                $.get("handlers/DeleteFile.ashx?id=" + file._id, function () {
                    $scope.File = null;
                    for (var i = 0; i < $scope.Project.Files.length; i++)
                        if ($scope.Project.Files[i]._id == file._id)
                            $scope.Project.Files.splice(i, 1);
                    
                    $scope.$apply($scope.Project);
                    dialog.close();
                });


            });
        }
        $scope.EditFile = function (file) {
            document.location.href = "Pipeline.aspx?siteid=" + $scope.Project._id + "&id=" + file._id;
        }
        
        
        ///blocks
        $scope.SetBlock = function (block) {
            
            $scope.Block = block;
        }
        $scope.EditBlock = function (block, file) {
            var url = "Pipeline.aspx?SiteId=" + $scope.Project._id + "&id=" + file._id + "&blockshow=" + block._id;
            document.location.href = url;
        }
        $scope.NewBlock = function () {
            var url = "Pipeline.aspx?SiteId=" + $scope.Project._id + "&id=" + $scope.File._id + "&gallery=true";
            document.location.href = url;
        }
        
        
        
        $scope.OpenShares = function (project) {
            
            //SiteId = project._id;
            
            angular.element("#share-form").scope().Load(project._id);
            
            BootstrapDialog.show({
                
                type: BootstrapDialog.TYPE_PRIMARY,
                size: BootstrapDialog.SIZE_LARGE,
                //height: $(window).height(),
                title: getIcon("bullhorn") + LNG.Share,
                message: $("#share-form").show(),
                onshow: function (dialogRef) {
                    
                    $(dialogRef.$modalBody).css("overflow", "hidden");
                    $(".bootstrap-dialog-footer-buttons .btn", $(dialogRef.$modal)).remove();

                },
                buttons: [{}]
            });
        }


    }]);
 



function getIcon(icon) {
    return '<span class="glyphicon glyphicon-' + icon + '"></span> ';
}
