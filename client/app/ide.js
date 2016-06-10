/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */
  
"use strict";

angular.module('nodulus').controller('ideController', 
    function ($scope, $User, $TreeMenu, $resource, $location, $compile,
     $Language, $mdSidenav, $mdBottomSheet, $Theme, $mdDialog, $Cache, $IDE) {
    $scope.$Theme = $Theme;
    $scope.$User = $User;
    $scope.$TreeMenu = $TreeMenu;
    $scope.$IDE = $IDE;
    $scope.$Language = $Language;
    
    if (localStorage.getItem("ApiUser") !== undefined) {
        $scope.User = JSON.parse(localStorage.getItem("ApiUser"));
        $scope.Logoff = function () {
            
            $scope.User = null;
            localStorage.setItem("ApiUser", null);
            $location.path("/login");
        }
    }
    
    if ($scope.User === undefined || $scope.User == null)
        $location.path("/login");
    
    $scope.TreeLoading = false;
    $scope.ShowSettings = false;
    $scope.toggleRight = function () {
        $scope.ShowSettings = !$scope.ShowSettings;
    }
    
    $scope.GetLanguageName = function (lcid) {
        return $Language.getByLCID(lcid).name;
    }
    
    $scope.ActiveTreeNode = {};
    $scope.selectedTabIndex = 0;
    
    $scope.EditItem = function (item) {
        item.Name = item.name;
        var itemKey = "b" + item.boneid + "n" + item.nsid + "o" + item.objid + "l" + item.lcid;
        if ($scope.TabByKey(itemKey) != null) {
            $scope.focusMe(itemKey);
            return;
        }
        item.itemKey = itemKey;
        $scope.Tabs.push(item);
        var tabPane = $("<div data-egen-page itemkey='" + itemKey + "' boneid='" + item.boneid + "' objid='" + item.objid + "' nsid='" + item.nsid + "' lcid='" + item.lcid + "'></div>");
        tabwrapper = $("<div></div>");
        tabwrapper.append(tabPane);
        $("#TabContainer").append(tabwrapper);
        var element = angular.element(tabPane);
        $compile(tabwrapper.contents())($scope);
        $scope.focusMe(itemKey);
    }
    
    $scope.showSelected = function (node) {
        var itemUrl = 'lobby.html';
        var item = { _id: node._id, name: node.Name, schemaid: node._id };
        $IDE.ShowLobby(item, node.Url);
      
    }
    
    $scope.loadSelected = function (node, expanded) {
        if (node !== undefined && expanded && node.Children != null && node.Children.length === undefined) {
            $scope.TreeLoading = true;
            $scope.subTreeResource.get({ ParentId: node.Id, skeletonid: node.skeletonId, lcid: 1037 }, function (data) {
                node.Children = data.items;
                $scope.TreeLoading = false;
            });
        }
    }
    
    $scope.showTreeBottomSheet = function ($event, node) {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'partials/TreeMenu.html',
            controller: 'TreeMenuCtrl',
            targetEvent: $event
        }).then(function (clickedItem) {
            clickedItem.method($event);
        });
    };
    
    $TreeMenu.initTreeMenu();
    
    $scope.SetActiveMenu = function (menu) {
        $scope.ActiveMenu = menu;
    }
    $scope.ActiveMenu = null;

    $scope.Refresh = function (tab) {
        
       

        var refresh_delegate = angular.element("#" + tab.itemKey +" div[ng-controller]").scope().refresh;
        if (refresh_delegate)
            refresh_delegate();

    
    
    }

})

.controller('CategoryDialog', function ($scope, $resource, $location, $compile, $mdDialog, $Theme, $Config, $EditCategory, $NodeCollection, $rootScope, $Cache) {
    $scope.EditCategory = $EditCategory;
    var lobbyResource = $resource(apiUrl + '/Navigation/', {}, {
        'get': { method: 'GET' },
        'save': { method: 'POST' },
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' },
        'delete': { method: 'DELETE' }
    });
    
    $scope.ParentCategory = null;
    $scope.LoadData = function (boneid) {
        $scope.RequestActive = true;
        lobbyResource.get({ boneid: boneid }, function (data) {
            $scope.EditCategory = data;
        });
    }
    
    $scope.LoadForParent = function (parentid) {
        $scope.RequestActive = true;
        lobbyResource.get({ boneid: parentid }, function (data) {
            $scope.RequestActive = false;
            $scope.Results = data.d;
        });
    }
    
    $scope.Update = function () {
        $scope.RequestActive = true;
        lobbyResource.save($scope.EditCategory, function (data) {
            $NodeCollection.push($scope.EditCategory);
            $scope.RequestActive = false;
            $mdDialog.hide();
        });
    };
    
    $scope.Cancel = function () {
        $mdDialog.hide();
    };
})



.controller('SettingsCtrl', function ($rootScope, $scope, $TreeMenu, $resource, $mdDialog,
     $Alerts, $location, $compile, $Language, $mdSidenav, $mdBottomSheet, $Theme, $translate, $IDE) {
    
    $scope.Languages = $Language.languages;
    $scope.Language = $Language.getByLCID(localStorage.getItem("lcid"));
    if ($scope.Language !== undefined && $scope.Language.direction == 'rtl') {
        $('link[id="languageCssfile"]').attr('href', "styles/bootstrap.rtl.css");
    }
    
    $scope.SetLanguage = function () {
        $Language.set($scope.Language).$promise.then(function (response) {
            $translate.use($scope.Language.shortname);
            $translate.preferredLanguage($scope.Language.shortname);
            $translate.fallbackLanguage($scope.Language.shortname);
            $translate.refresh();
            localStorage.setItem("lcid", $scope.Language.lcid);
            if ($scope.Language !== undefined && $scope.Language.direction == 'rtl') {
                $('link[id="languageCssfile"]').attr('href', "styles/bootstrap.rtl.css");
            } else {
                
                if ($Theme.theme !== undefined) {
                    var themelink = "themes/" + $Theme.theme + "/bootstrap.min.css";
                    $('link[id="languageCssfile"]').attr('href', themelink);
           
                }
            }
        });
    }
    
    $scope.Theme = $Theme.theme;
    
    $scope.Themes = ["amelia", "blooming", "cerulean", "desert" , "paper", "green", "readable", "simplex", "spacelab", "Liquorice Schnitzel", "flat", "cyborg", "United", "superhero", "journal", "Lumen"];
    var theme = localStorage.getItem("theme");
    if (theme !== null && theme !== undefined) {
        $scope.Theme = theme;
    }
    else {
        $scope.Theme = "paper";
    }
    
    $scope.$watch("Theme", function (theme_name, oldVal) {
        if (theme_name !== undefined) {
            var theme = "themes/" + theme_name + "/bootstrap.min.css";
            $('link[id="mainthemefile"]').attr('href', theme);
            localStorage.setItem("theme", theme_name);
        }
    });
})
//.directive('ckEditor', [function () {
//        return {
//            require: '?ngModel',
//            link: function ($scope, elm, attr, ngModel) {
                
//                var ck = CKEDITOR.replace(elm[0]);
                
//                ck.on('pasteState', function () {
//                    $scope.$apply(function () {
//                        ngModel.$setViewValue(ck.getData());
//                    });
//                });
                
//                ngModel.$render = function (value) {
//                    ck.setData(ngModel.$modelValue);
//                };
//            }
//        };
//    }])
.directive('egenLongClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.egenLongClick);
        
        element.bind('contextmenu', function (event) {
            
            scope.$apply(function () {
                
                event.preventDefault();
                fn(scope, { $event: event });
            });
        });
    };
})
.directive('anyDialog', function () {
    return {
        scope: false,
        replace: true,
        templateUrl: 'partials/dialog.html',
        link: function (scope, element, attr, $compile) {
            
            var queueLen = angular.module('nodulus')._invokeQueue.length;
            
            var scriptSrc = attr.anyDialog.replace(".aspx", ".js");
            var subControllerName = attr.anyDialog.replace(".aspx", "controller").toLowerCase();
            scriptSrc = scriptSrc.replace(".html", ".js");
            $.ajax({
                async: false,
                url: "partials/manage/" + scriptSrc,
                dataType: "script"
            });
            
            var src = attr.anyDialog.replace(".aspx", ".html");
            scope.InsidePartial = "partials/manage/" + src;
            
            scope.PaneHeight = $(window).height() - 100;
            window.onresize = function () {
                scope.PaneHeight = $(window).height() - 100;
            };
            
            element.append("<div static-include=\"" + scope.InsidePartial + "\" aria-label='xxxx'></div> ");
            
            
            
            // Register the controls/directives/services we just loaded
            var queue = angular.module('nodulus')._invokeQueue;
            
            for (var i = queueLen; i < queue.length; i++) {
                var call = queue[i - 1];
                
                try {
                    if (call[2][0].toLowerCase() != subControllerName)
                        call = queue[i];
                } catch (e) { }
                // call is in the form [providerName, providerFunc, providerArguments]
                var provider = providers[call[0]];
                if (provider) {
                    
                    // e.g. $controllerProvider.register("Ctrl", function() { ... })
                    provider[call[1]].apply(provider, call[2]);
                }
            }
            
            
            element.injector().invoke(function ($compile) {
                
                $compile(element.contents())(scope);
                
                element.scope().ParentCategory = scope.ParentCategory;
            });
        }
    };
})
.directive('anyLobby', function () {
    return {
        templateUrl: 'partials/any.html',
        link: function (scope, element, attr, $compile) {
            var queueLen = angular.module('nodulus')._invokeQueue.length;
            
            var scriptSrc = attr.anyLobby.replace(".aspx", ".js");
            var subControllerName = attr.anyLobby.replace(".aspx", "controller").toLowerCase();
            scriptSrc = scriptSrc.replace(".html", ".js");
            $.ajax({
                async: false,
                url: scriptSrc,
                dataType: "script"
            });
            
            scope.PaneHeight = $(window).height() - 100;
            window.onresize = function () {
                scope.PaneHeight = $(window).height() - 100;
            };
            
            var src = attr.anyLobby.replace(".aspx", ".html");
            scope.InsidePartial = src;
            
            $("div", element).html("<div ng-include=\"'" + scope.InsidePartial + "'\" aria-label=''></div> ");
            // Register the controls/directives/services we just loaded
            var queue = angular.module('nodulus')._invokeQueue;
            
            for (var i = queueLen; i < queue.length; i++) {
                var call = queue[i - 1];
                
                try {
                    if (call[2][0].toLowerCase() != subControllerName)
                        call = queue[i];
                } catch (e) { }
                // call is in the form [providerName, providerFunc, providerArguments]
                var provider = providers[call[0]];
                if (provider) {
                    
                    // e.g. $controllerProvider.register("Ctrl", function() { ... })
                    provider[call[1]].apply(provider, call[2], scope);
                }
            }
            
            
            var c = element.injector().invoke(function ($compile) {
                
                $compile(element.contents())(scope);
            }, this, scope);
           
            

        }, 
        scope: {
            'itemobject': '@itemobject',
            'itemKey': '@itemkey',
            'schemaid': '@', // OK
            'lcid': '@lcid', // OK
            'editItem': "&editItem"
        }
    };
})
.directive('staticInclude', function ($timeout, $http, $templateCache, $compile, $parse) {
    return {
        replace: true,
        link: function (scope, element, attrs) {
            attrs.$observe("staticInclude", function (newVal, oldVal) {
                var templatePath = attrs.staticInclude;
                if (templatePath == "")
                    return;
                
                
                // ngProgress.start();
                
                
                
                $timeout(function () {
                    $http.get(templatePath, { cache: $templateCache }).success(function (response) {
                        
                        
                        if (response.indexOf("<html") > -1)
                            return;
                        
                        
                        var contents = element.html(response).contents();
                        
                        
                        $compile(contents)(scope);
                        
                        var invoker = $parse(attrs.complete);
                        invoker(scope);
                         
                       // ngProgress.complete();
                    });

                }, 100);




            })
        }
    }
})
.directive('egenPage', function () {
    return {
        templateUrl: 'partials/page.html',
        controller: "pageController",
        scope: {
            'itemkey': '@itemkey',
            'nsid': '@nsid',
            'lcid': '@lcid',
            'objid': '@objid',
            'boneid': '@boneid', // OK
            'editItem': "&editItem"
        }
    };
})
.directive('spinner', function () {
    return {
        restrict: 'E',
        template: '<div class="spinner">      <div class="rect1"></div>      <div class="rect2"></div>      <div class="rect3"></div>      <div class="rect4"></div>      <div class="rect5"></div>    </div>'

    };
})
.directive('imageTransform', function () {
    return {
        require: 'ngModel',
        templateUrl: 'partials/directives/image-transform.html',
        link: function ($scope, elem, attr, ctrl) {
            
            // $scope.ImageString = attr.ngModel;
            $(elem).parents(".fileinput-button").siblings("span").html("<img src='" + $scope.ImageString + "' style='max-width: 90px'/>");

        },
        controller: function ($scope) {
            $scope.ConvertFile = function (obj) {
                $scope.imagePreview("", obj, $scope);
            }
            
            $scope.imagePreview = function (src, fileI, $scope) {
                
                /* Read file and load preview */
                var n = fileI;
                
                if (n && "files" in n && n.files && n.files.length > 0 && n.files[0]) {
                    if ("type" in n.files[0] && !n.files[0].type.match("image.*")) return;
                    if (!FileReader) return;
                    //imgPreview.getElement().setHtml("Loading...");
                    var fr = new FileReader();
                    fr.onload = (function (f) {
                        return function (e) {
                            
                            $scope.ImageString = e.target.result;
                            $scope.$apply($scope.ImageString);
                            //$scope.BlockPlanVersion.Descriptor[scopefield] = e.target.result;
                            $(fileI).parents(".fileinput-button").siblings("span").html("<img src='" + e.target.result + "' style='max-width: 90px'/>");
                            //setDirty();
                        };
                    })(n.files[0]);
                    fr.onerror = function () {

                    };
                    fr.onabort = function () {

                    };
                    fr.readAsDataURL(n.files[0]);
                }
            }

        },
        scope: {
            'ImageString': '=image',
             
        }
    };
})
.controller('pageController', function ($scope, $resource, $location, $compile, $http, $Status, $Language) {
    
    $http.defaults.useXDomain = true;
    $scope.Statuses = $Status();
    $scope.ItemLoading = true;
    $scope.IsSaving = false;
    $scope.GetObject = {};
    $scope.SetObject = {};
    
    
    $scope.reconstruct = function (obj, prefix, tablename) {
        var complex = {};
        for (var i in obj) {
            if (i.indexOf(prefix + "_") == 0) {
                complex[i.replace(prefix + '_', '')] = obj[i];

                //delete obj[i];
            }


        }
        if (complex !== {}) {
            
            obj[prefix] = complex;
        }
        obj["tablename"] = tablename;
        return obj;


    }
    $scope.fieldcount = function (arr, name, tname) {
        var res = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].FieldName == name && arr[i].tablename == tname)
                res++;
        }
        return res;


    }
    var schemaResource = $resource(apiUrl + '/schemas/', { nsid: "@nsid" });
    var itemResource = $resource(apiUrl + '/Item/', { boneid: "@boneid", nsid: "@nsid", objid: "@objid", lcid: "@lcid" });
    $scope.updateitemResource = $resource(apiUrl + '/Item/', { updateObject: "@updateObject" });
    var globalDisplay = "";
    schemaResource.get({ nsid: $scope.nsid }, function (data) {
        $scope.tempSchema = data.Schema;
        globalDisplay = data.Display;
        
        itemResource.get({ boneid: $scope.boneid, nsid: $scope.nsid, objid: $scope.objid, lcid: $scope.lcid }, function (data) {
            
            
            var tempObj = JSON.parse(data.ItemJson);
            
            
            
            for (var i = 0; i < $scope.tempSchema.length; i++) {
                
                
                if ($scope.SetObject == null || $scope.SetObject === undefined)
                    $scope.SetObject = {};
                
                
                
                if ($scope.SetObject[$scope.tempSchema[i].tablename] === undefined)
                    $scope.SetObject[$scope.tempSchema[i].tablename] = {};
                var key = "";
                if ($scope.fieldcount($scope.tempSchema, $scope.tempSchema[i].FieldName, $scope.tempSchema[i].tablename) > 1) {
                    
                    tempObj = $scope.reconstruct(tempObj, $scope.tempSchema[i].FieldName, $scope.tempSchema[i].tablename);
                    //key = $scope.tempSchema[i].FieldName + "_" + $scope.tempSchema[i].propName;
                    $scope.SetObject[$scope.tempSchema[i].tablename][$scope.tempSchema[i].FieldName + "_" + $scope.tempSchema[i].propName] = tempObj[$scope.tempSchema[i].FieldName][$scope.tempSchema[i].propName];
                }
                else {
                    tempObj = $scope.reconstruct(tempObj, '', $scope.tempSchema[i].tablename);
                    key = $scope.tempSchema[i].FieldName;
                    $scope.SetObject[$scope.tempSchema[i].tablename][$scope.tempSchema[i].FieldName] = tempObj[key];
                }
                $scope.tempSchema[i].FieldValue = tempObj[$scope.tempSchema[i].FieldName];






                // $scope.SetObject[scope.schema[0].tablename][scope.schema[0].FieldName] = newvalue;
            }
            
            $scope.SetObject.ObjId = $scope.objid;
            $scope.SetObject.NsId = $scope.nsid;
            $scope.SetObject.LCID = $scope.lcid;
            $scope.SetObject.BoneId = $scope.boneid;
            
            
            $scope.GetObject = tempObj;
            
            $scope.Schema = $scope.tempSchema;
            $scope.Display = globalDisplay;
            $scope.ItemLoading = false;
        });

    })
    
    
    $scope.Save = function () {
        
        
        $scope.IsSaving = true;
        $scope.updateitemResource.save({ updateObject: JSON.stringify($scope.SetObject) }, function () {
            $scope.IsSaving = false;
        });
    }







})
.service("$TreeMenu", function ($resource, $mdDialog, $mdBottomSheet) {
    
    var TreeResource = $resource("/modules/listnav");
    var instance = this;
    instance.initTreeMenu = function () {
        TreeResource.query(function (data) {
            
            
            
            instance.Menus = [];
            for (var i = 0; i < data.length; i++) {
                data[i].module = data[i].module.name;
                instance.Menus.push(data[i]);
            }
            
            instance.treeOptions = {
                nodeChildren: "Children"
            };
            
 
          
        });
    };
    
    $("#sidebar").on('contextmenu', 'a', function (event) {
        var $scope = angular.element("html").scope();
        $scope.$apply(function () {
            //get the parent menuscope
            var nodeSearch = angular.element(event.toElement).scope();;
            var activeNode = angular.element(event.toElement).scope();
            
            while (nodeSearch.$parent.menu === undefined && nodeSearch.$parent !== undefined)
                nodeSearch = nodeSearch.$parent;
            
            if (nodeSearch.$parent.menu !== undefined)
                nodeSearch = nodeSearch.$parent.menu;
            
            event.preventDefault();
            if (nodeSearch !== null)
                nodeSearch.showTreeBottomSheet({ event: event, node: activeNode.row.branch });
        });
    });
    
   // $scope.TreeLoading = true;
   

});

//function guid() {
//    function s4() {
//        return Math.floor((1 + Math.random()) * 0x10000)
//      .toString(16)
//      .substring(1);
//    }
//    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//    s4() + '-' + s4() + s4() + s4();
//}