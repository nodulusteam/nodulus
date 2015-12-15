angular.module('ApiAdmin').controller('ideController', function ($scope, $User, $TreeMenu, $resource, $location, $compile,
     $Language, $mdSidenav, $mdBottomSheet, $Theme, $mdDialog, $Cache, $IDE) {
    $scope.$Theme = $Theme;
    $scope.$User = $User;
    $scope.$TreeMenu = $TreeMenu;
    $scope.$IDE = $IDE;
    //$scope.Language = $Language.getActive();
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
    $scope.toggleRight = function () {        
        $mdSidenav('right').toggle();
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
        //item.tabPane = tabPane;
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
                
                
                //for (var i = 0; i < data.items.length; i++)
                //    if (data.items[i].Left + 1 < data.items[i].Right)
                //        data.items[i].Children = {};
                
                node.Children = data.items;
                $scope.TreeLoading = false;
                // $scope.$apply(node.Children);
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
            //$scope.alert = clickedItem.name + ' clicked!';
        });
    };
    
    
    
    $TreeMenu.initTreeMenu();
    
    
     
    
    $scope.SetActiveMenu = function (menu) {
        $scope.ActiveMenu = menu;
    }
    $scope.ActiveMenu = null;
     


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
.controller('SchemaDialog', function ($scope, $resource, $location, $compile, $mdDialog, $Theme, $Config, $EditCategory, $rootScope, $Cache) {
    
    
    $scope.EditCategory = $EditCategory;
    $scope.$Theme = $Theme;
    //$DataTable.Load();
    //$scope.DataTables = $DataTable.Tables;
    //$scope.DataTablesDic = $DataTable.TablesDic;
    $scope.RequestActive = false;
    //.success(function (data) {
    
    //    $scope.DataTables = data.Table;
    //})
    
    
    
    $scope.EditCategory = { type: "object", "required": [], "properties": {} }
    //$scope.EditCategory["schema"] = { fields: [] };
    
    $scope.GetTable = function (id) {
        
        return $scope.DataTablesDic[id];
    }
    
    //var header = { 'token': $User.User.Token, "patientid": $User.User._id };
    
    var lobbyResource = $resource(apiUrl + '/schemas/', {}, {
        'get': { method: 'GET' },
        'save': { method: 'POST' },
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' },
        'delete': { method: 'DELETE' }
    });
    
    
    
    var nameResource = $resource('/schemas/collections', {}, {
        'get': { method: 'GET' },
        'save': { method: 'POST' },
        'query': { method: 'GET', isArray: true },
        'update': { method: 'PUT' },
        'delete': { method: 'DELETE' }
    });
    nameResource.query({}, function (data) {
        $Cache.ready("schemas", function (schemas) {
            debugger
            var result = [];
            for (var i = 0; i < data.length; i++) {
                for (var x = 0; x < schemas.length; x++) {
                    if (schemas[x].name === data[i].name) {
                        
                        data.splice(i, 1);
                        i = 0;
                    }
                }
            }
            
            if (data.length > 0)
                $scope.NamingMode = "existing";
            
            $scope.NotMappedSchemas = data;
        });
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
        if ($scope.EditCategory._id !== undefined) {
            lobbyResource.update($scope.EditCategory, function (data) {
                $scope.RequestActive = false;
                $mdDialog.hide();
                $rootScope.$broadcast("updateMenus");
            });
        }
        else {
            $scope.EditCategory._id = guid();
            lobbyResource.save($scope.EditCategory, function (data) {
                $scope.RequestActive = false;
                $mdDialog.hide();
                $rootScope.$broadcast("updateMenus");
            });
        }
    };
    $scope.Cancel = function () {
        $mdDialog.hide();
    };

})
.controller('SettingsCtrl', function ($rootScope, $scope, $TreeMenu, $resource, $mdDialog, $Alerts, $location, $compile, $Language, $mdSidenav, $mdBottomSheet, $Theme) {
    
    $scope.Languages = $Language.languages;
    // $scope.Language = $Language.language;
    
    $scope.Language = $Language.getByLCID(localStorage.getItem("lcid"));
    debugger;
    if ($scope.Language !== undefined && $scope.Language.direction == 'rtl') {
        $('link[id="languageCssfile"]').attr('href', "styles/bootstrap.rtl.css");
    }

    
    
    //if (language === null)
    //    language = { name: "english", shortname: "eng", "lcid": 1033 };
    //else
    //    language = angular.fromJson(language);
    
    
    
    //$scope.Language = language;
    
    
    $scope.SetLanguage = function () {
        $Language.set($scope.Language).$promise.then(function (response) {            
            localStorage.setItem("lcid", $scope.Language.lcid);            
            var resourceSetResolves = {};
            var arr = angular.fromJson(response.Results);
            for (var i = 0; i < arr.length; i++) {                
                resourceSetResolves[arr[i].Key] = arr[i].Value;
            }
            //$scope.DataTables = data.Tables;
            $scope.LNG = resourceSetResolves;
            
            angular.element("html").scope().LNG = resourceSetResolves;
            //$scope.$apply(angular.element("html").scope());


        });

    }
    
    $scope.Theme = $Theme.theme;
    
    
    $scope.Themes = ["amelia", "blooming", "cerulean", "desert" , "paper", "green", "readable", "Rouge", "simplex", "spacelab", "Liquorice Schnitzel", "flat", "cyborg", "United", "superhero", "journal", "Lumen"];
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
    
  
    //$scope.SetTheme = function (theme) {
    
    //    $Theme.setTheme($scope.Theme);
    //    //$scope.$parent.$parent.Theme = $scope.Theme;
    //    $scope.bootstrapThemeLink = "themes/" + $scope.Theme;
    //    var stylers = $('link[styler="true"]');
    //    stylers.each(function () {
    
    //        $(this).attr('href', $scope.bootstrapThemeLink + $(this).attr("styler-path"));
    //    })
    
    
    
    //    localStorage.setItem("theme", $scope.Theme);
    //}
    //$scope.Themes = ['default', 'amber', 'blue', 'brown', 'cyan', 'deep-orange', 'grey', 'red', 'teal', 'pink', 'lime', 'green'];
    $scope.Install = function () {
        
        $scope.ModuleLoading = true;
        var setupRes = $resource("/modules/install");
        setupRes.save({ name: $scope.Module.Name }, function (data) {
             
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
            $Alerts.add({ type: 'success', msg: 'module: ' + module.name  + ' packed', 'icon': 'fa fa-check' });
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
.directive('ckEditor', [function () {
        return {
            require: '?ngModel',
            link: function ($scope, elm, attr, ngModel) {
                
                var ck = CKEDITOR.replace(elm[0]);
                
                ck.on('pasteState', function () {
                    $scope.$apply(function () {
                        ngModel.$setViewValue(ck.getData());
                    });
                });
                
                ngModel.$render = function (value) {
                    ck.setData(ngModel.$modelValue);
                };
            }
        };
    }])
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
            
            var queueLen = angular.module('ApiAdmin')._invokeQueue.length;
            
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
            var queue = angular.module('ApiAdmin')._invokeQueue;
            
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

                    // $(element).css("opacity", "100");
            });


        }

    };
})
.directive('anyLobby', function () {
    return {
        templateUrl: 'partials/any.html',
        link: function (scope, element, attr, $compile) {
            
            var queueLen = angular.module('ApiAdmin')._invokeQueue.length;
            
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
            
            // element.append("<div ng-include=\"'" + scope.InsidePartial + "'\" aria-label=''></div> ");
            
            
            
            // Register the controls/directives/services we just loaded
            var queue = angular.module('ApiAdmin')._invokeQueue;
            ////debugger
            for (var i = queueLen; i < queue.length; i++) {
                var call = queue[i - 1];
                
                try {
                    if (call[2][0].toLowerCase() != subControllerName)
                        call = queue[i];
                } catch (e) { }
                // call is in the form [providerName, providerFunc, providerArguments]
                var provider = providers[call[0]];
                if (provider) {
                    ////debugger
                    // e.g. $controllerProvider.register("Ctrl", function() { ... })
                    provider[call[1]].apply(provider, call[2], scope);
                }
            }
            
            ////debugger
            var c = element.injector().invoke(function ($compile) {
                $compile(element.contents())(scope);
            }, this, scope);
            ////debugger
            

        },
        //    compile: function (element, attributes) {
        //        return {
        //            pre: function (scope, element, attributes, controller, transcludeFn) {                     
        
        
        //            },
        //            post: function (scope, element, attributes, controller, transcludeFn) {
        
        
        //                //element.injector().invoke(function ($compile) {
        
        //                //    $compile(element)(scope)
        //                //    scope.$apply();
        //                //});
        
        
        //                alert(ProfilesController);
        
        //            }
        
        //        //    ,
        //        //link: function (scope, element, attr) {             
        //        //    var src = attr.anyLobby.replace(".aspx", ".html");
        //        //    scope.InsidePartial = "partials/manage/" +  src;
        //        //}
        //}
        //    },
        
        
        
        
        //controller: function () {
        
        
        
        //},
        scope: {
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
                        //$(element).addClass("animated").addClass("fadeIn").removeClass("fadeOut");
                        
                        $compile(contents)(scope);
                        
                        var invoker = $parse(attrs.complete);
                        invoker(scope);
                        //$(".articlelistposition .articleBannerWrapper").addClass("animated").addClass("zoomInLeft").removeClass("zoomOutRight");
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
.controller('SchemaTreeMenuCtrl', function ($scope, $mdBottomSheet, $mdDialog, $resource, $rootScope, $IDE) {
    
    $scope.items = [
        //{ name: 'Add child category', icon: 'add', method: AddCategory },
        { name: 'Edit Collection', icon: 'fa fa-cog', method: EditCategory },
        { name: 'Remove', icon: 'fa fa-close' , method: DeleteCategory },
        { name: 'Edit Schema', icon: 'fa fa-edit', method: EditSchema }
    ];
    
    
    function AddCategory(parent) {
        
        
        $mdDialog.show({
            template: "<div data-any-lobby=\"" + "/dialogs/category.html" + "\" flex='80'></div>",
            
            //templateUrl: 'partials/dialogs/category.html',
            //controller: 'GreetingController'
            onComplete: function () {
                
                
                angular.element("#CategoryDialogScope").scope().LoadForParent(parent.Id);
            },
            //locals: { employee: $scope.userName }
        });

    }
    
    function EditSchema(item) {
        var url = 'modules/schemas/schemas.html';      
        item.node.schemaid = item.node._id;         
        item.node.itemKey = "schema_" + item.node._id;
        $IDE.ShowLobby(item.node, url);
    }

    function DeleteCategory(category) {        
        var lobbyResource = $resource(apiUrl + '/schemas/', {}, {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'query': { method: 'GET', isArray: true },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        });
        
        
        lobbyResource.delete({ "_id": category.node._id }, function (data) {
            $rootScope.$broadcast("updateMenus");


        })
    }
    
    function EditCategory(category) {
        
        
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            templateUrl: 'partials/manage/dialogs/category.html',
            controller: 'CategoryDialog',
            locals: { "$EditCategory": category },
            
            //templateUrl: 'partials/dialogs/category.html',
            //controller: 'GreetingController'
            onComplete: function () {
               // alert("complete");
                
                //angular.element("#CategoryDialogScope").scope().LoadForParent(0);
            },
            //locals: { employee: $scope.userName }
        });
        

        //$mdDialog.show({
        //    template: "<div data-any-lobby=\"" + "/dialogs/category.html" + "\" flex='80'></div>",
        //    //templateUrl: 'partials/dialogs/category.html',
        //    //controller: 'GreetingController'
        //    onComplete: function () {

        //        angular.element("#CategoryDialogScope").scope().LoadData(category.Id);
        //    },
        //    //locals: { employee: $scope.userName }
        //});

    }
    
    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
})
.controller('TreeMenuCtrl', function ($scope, $mdBottomSheet, $mdDialog, $resource, $rootScope, $IDE) {
    
    $scope.items = [
        //{ name: 'Add child category', icon: 'add', method: AddCategory },
        { name: 'Edit Category', icon: 'fa fa-cog', method: EditCategory },
        { name: 'Remove', icon: 'fa fa-close' , method: DeleteCategory },
        { name: 'Edit Schema', icon: 'fa fa-edit', method: EditSchema }
    ];
    
    
    function AddCategory(parent) {
        
        
        $mdDialog.show({
            template: "<div data-any-lobby=\"" + "/dialogs/category.html" + "\" flex='80'></div>",
            
            //templateUrl: 'partials/dialogs/category.html',
            //controller: 'GreetingController'
            onComplete: function () {
                
                
                angular.element("#CategoryDialogScope").scope().LoadForParent(parent.Id);
            },
            //locals: { employee: $scope.userName }
        });

    }
    
    function EditSchema(item) {
        var url = 'Schemas.html';
        var scope = angular.element("#view").scope();
        item.node.schemaid = item.node._id;
        item.node.itemKey = "schema_" + item.node._id;
        item.node.name = item.node.label;
        $IDE.ShowLobby(item.node, url);
    }
    function DeleteCategory(category) {
        
        var lobbyResource = $resource(apiUrl + '/schemas/', {}, {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'query': { method: 'GET', isArray: true },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        });
        
        
        lobbyResource.delete({ "_id": category.node._id }, function (data) {
            $rootScope.$broadcast("updateMenus");


        })
    }
    
    function EditCategory(category) {
        
        
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            templateUrl: 'partials/manage/dialogs/category.html',
            controller: 'CategoryDialog',
            locals: { "$EditCategory": category },
            
            //templateUrl: 'partials/dialogs/category.html',
            //controller: 'GreetingController'
            onComplete: function () {
               // alert("complete");
                
                //angular.element("#CategoryDialogScope").scope().LoadForParent(0);
            },
            //locals: { employee: $scope.userName }
        });
        

        //$mdDialog.show({
        //    template: "<div data-any-lobby=\"" + "/dialogs/category.html" + "\" flex='80'></div>",
        //    //templateUrl: 'partials/dialogs/category.html',
        //    //controller: 'GreetingController'
        //    onComplete: function () {

        //        angular.element("#CategoryDialogScope").scope().LoadData(category.Id);
        //    },
        //    //locals: { employee: $scope.userName }
        //});

    }
    
    $scope.listItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
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
    
    var TreeResource = $resource(apiUrl + '/Navigation/');
    var instance = this;
    instance.initTreeMenu = function () {
        TreeResource.get(function (data) {
            var navs = data.items;
            
            instance.treeOptions = {
                nodeChildren: "Children"
            };
            
            
            instance.Menus = [{
                    id: 1, 'name': "Categories" , icon: 'fa fa-folder-open', type: 'categories', 
                    showTreeBottomSheet: function ($event, node) {
                        
                        
                        
                        $mdBottomSheet.show({
                            templateUrl: 'partials/TreeMenu.html',
                            controller: 'TreeMenuCtrl',
                            targetEvent: $event
                        }).then(function (clickedItem) {
                            
                            clickedItem.method($event);
            //$scope.alert = clickedItem.name + ' clicked!';
                        });
                    },
                    AddCategory: function (menu) {
                        
                        
                        var parentEl = angular.element(document.body);
                        
                        
                        
                        $mdDialog.show({
                            parent: parentEl,
                            templateUrl: 'partials/manage/dialogs/category.html',
                            controller: 'CategoryDialog',
                            locals: { "$EditCategory": { _id: guid(), ParentId: '00000000-0000-0000-0000-000000000000' }, "$NodeCollection": menu.children },
                            onComplete: function () { }
                        });

                    }
                }, {
                    id: 2, 'name': 'Data', icon: 'fa fa-database' , 'type': 'schemas',
                    showTreeBottomSheet: function ($event, node) {
                        $mdBottomSheet.show({
                            templateUrl: 'partials/SchemaTreeMenu.html',
                            controller: 'SchemaTreeMenuCtrl',
                            targetEvent: $event
                        }).then(function (clickedItem) {
                            clickedItem.method($event);
                        });
                    },
                    AddCategory: function (menu) {
                        var parentEl = angular.element(document.body);
                        $mdDialog.show({
                            parent: parentEl,
                            templateUrl: 'partials/manage/dialogs/schema.html',
                            controller: 'SchemaDialog',
                            locals: { "$EditCategory": { ParentId: '00000000-0000-0000-0000-000000000000' }, "$NodeCollection": menu.children },
                            onComplete: function () { }
                        });

                    }
                }];
            instance.Menu = navs;
            instance.subTreeResource = $resource(apiUrl + '/Navigation/', { ParentId: "@parentid" });
            instance.schemaTreeResource = $resource(apiUrl + '/schemas/', {});
            angular.forEach(instance.Menus, function (value, key) {
                
                switch (value.type) {
                    case "categories":
                        instance.TreeLoading = true;
                        instance.subTreeResource.get({ ParentId: '00000000-0000-0000-0000-000000000000' }, function (data) {
                            
                            
                            
                            for (var i = 0; i < data.items.length; i++) {
                                
                                if (data.items[i].Left + 1 < data.items[i].Right)
                                    data.items[i].Children = {};
                            }
                            
                            
                            value.children = data.items;
                            instance.TreeLoading = false;
                        });
                        break;
                    case "schemas":
                        
                        
                        instance.TreeLoading = true;
                        instance.schemaTreeResource.get({}, function (data) {
                            value.children = [];                             
                            for (var i = 0; i < data.items.length; i++) {
                                value.children.push({
                                    Alias: data.items[i].name ,
                                    Name: data.items[i].name ,
                                    ParentId: "00000000-0000-0000-0000-000000000000",
                                    Url: "/modules/schemas/lobby.html",
                                    _id: data.items[i]._id,
                                    label: data.items[i].name
                                });

                                 
                            }
                            
                            
                            
                            instance.TreeLoading = false;
                        });
                        break;


                }
                
            });
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

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}