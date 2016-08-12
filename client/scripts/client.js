/*                _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | �Roi ben haim  �2016    
 */
"use strict";
var loader_count = 0;
/**
 * basic nodulus dependencies
 */
var nodulus_dependecies = ['infinite-scroll', 'anguFixedHeaderTable', 'm43nu.auto-height',
    'mgcrea.ngStrap', 'mj.scrollingTabs', 'ui.bootstrap', 'ui.ace', 'ngSanitize', 'ngRoute', 'ngResource', 'angular.filter', 'angularBootstrapNavTree',
    'treeControl', 'ngMaterial', 'ngMessages', 'ngAnimate', 'RecursionHelper', 'DynamicDataSerivces', 'Cache', 'IDE', 'pascalprecht.translate', 'cfp.hotkeys'];
var delay_bootstraping = false;
angular.element(document).ready(function () {
    for (var module_name in nodulus_mapping) {
        var module = nodulus_mapping[module_name];
        for (var i = 0; i < module.scripts.length; i++) {
            delay_bootstraping = true;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            script.defer = true;
            script.src = module_name + "/scripts/" + module.scripts[i];
            script.onload = function () {
                loader_count--;
                if (loader_count == 0) {

                    angular.bootstrap(document, ['nodulus']);

                }
            }
            document.getElementsByTagName('body')[0].appendChild(script);
            loader_count++;
        }

        if (module.styles) {
            for (var i = 0; i < module.styles.length; i++) {

                var fileref = document.createElement('link');

                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", module_name + "/styles/" + module.styles[i])


                document.getElementsByTagName('head')[0].appendChild(fileref);
            }

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

});

/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016    
 */



/*jslint node: true */
"use strict";
if (!location.origin)
    location.origin = location.protocol + "//" + location.host;



var apiUrl = "@nodulus/api/";
var logedinuser = {};
var LNG = {}
var socket = {};
var socketsInitialized = false;
/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;
var nodulus = {}
var regModules = ["ng"];

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element($window);
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {


                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;
                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
    }
]);

var providers = {};
//'schemaForm'

/**
 * module declaration
 */

console.debug('nodulus_dependecies',nodulus_dependecies);
 

var DynamicData = angular.module('nodulus', nodulus_dependecies)
    .config(['$controllerProvider', '$resourceProvider', '$routeProvider', '$mdThemingProvider', '$compileProvider', '$provide', '$injector', '$translateProvider', 'hotkeysProvider',
        function ($controllerProvider, $resourceProvider, $routeProvider, $mdThemingProvider, $compileProvider, $provide, $injector, $translateProvider, hotkeysProvider) {
            // $resourceProvider.defaults.stripTrailingSlashes = false;
            hotkeysProvider.includeCheatSheet = true;
            providers = {
                $controllerProvider: $controllerProvider,
                $compileProvider: $compileProvider,
                $provide: $provide,
                $injector: $injector
            };

            $translateProvider.useSanitizeValueStrategy(null);
            $translateProvider.useUrlLoader('/@nodulus/translations/languages');


            var lcid = localStorage.getItem("lcid");

            var languages = {
                1033: {
                    name: "english",
                    shortname: "eng",
                    "lcid": 1033,
                    "align": "left",
                    "direction": "ltr",
                    "alignInvert": "right",
                    "directionInvert": "rtl"
                }
                ,
                1037: {
                    name: "hebrew",
                    shortname: "heb",
                    "lcid": 1037,
                    "align": "right",
                    "direction": "rtl",
                    "alignInvert": "left",
                    "directionInvert": "ltr"
                }

            }
                ;
            if (lcid === null)
                lcid = 1033;


            var LanguageFromCookie = languages[lcid];


            $translateProvider.use(LanguageFromCookie.shortname);
            $translateProvider.preferredLanguage(LanguageFromCookie.shortname);
            $translateProvider.fallbackLanguage(LanguageFromCookie.shortname);



            $routeProvider.
                when("/setup", { templateUrl: "partials/setup.html", controller: "setupController" }).
                when("/login", { templateUrl: "partials/login.html", controller: "loginController" }).
                when("/register", { templateUrl: "partials/register.html", controller: "registerController" }).
                when("/manage", { templateUrl: "partials/manage.html", controller: "ideController" }).
                //when("/drivers/:id", { templateUrl: "partials/driver.html", controller: "driverController" }).
                otherwise({ redirectTo: '/manage' });
        }])
    /**
     * language provider
     */
    .provider('$Language', [function () {


        this.$get = function ($resource) {
            var languageResource = $resource(apiUrl + '/Languages/', { "lcid": "@lcid" });

            return {
                language: null,
                getActive: function () {
                    return this.language;
                },
                resourceSet: null,
                set: function (language) {

                    this.language = language;
                    less.modifyVars({
                        '@direction': language.direction,
                        '@align': language.align
                    });

                    //this.resourceSet = this.getResourceSet(language);
                    return this.getResourceSet(language)
                },
                getByLCID: function (lcid) {

                    if (lcid == null)
                        return this.languages[0];

                    for (var i = 0; i < this.languages.length; i++)
                        if (this.languages[i].lcid == lcid)
                            return this.languages[i];

                },
                getSetring: function (key) {

                    return this.resourceSet[key];
                },
                getResourceSet: function (language) {


                    var promise = languageResource.get({ "lcid": language.lcid });
                    return promise;


                },
                languages: [{
                    name: "english",
                    shortname: "eng",
                    "lcid": 1033,
                    "align": "left",
                    "direction": "ltr",
                    "alignInvert": "right",
                    "directionInvert": "rtl"
                },
                    {
                        name: "hebrew",
                        shortname: "heb",
                        "lcid": 1037,
                        "align": "right",
                        "direction": "rtl",
                        "alignInvert": "left",
                        "directionInvert": "ltr"
                    }]

            }
        }
    }])
    .provider('$DataTable', [function () {
        this.$get = function ($resource) {
            var datatableResource = $resource(apiUrl + '/DataTable/', {});

            return {
                TablesDic: {},
                Tables: [],
                GetTableName: function (id) {
                    return TablesDic["" + id].name;
                },
                GetTableIcon: function (id) {
                    return "images/gallery4.png";
                },
                Load: function () {
                    var _tables = this.Tables;
                    var _tablesDic = this.TablesDic;
                    datatableResource.get({}, function (data) {
                        _tables = data.Tables;
                        for (var i = 0; i < _tables.length; i++) {
                            _tablesDic["" + _tables[i].Id] = _tables[i];
                        }
                    });
                }
            }


        }
    }])
    .provider("$Config", function () {
        var type;
        return {
            setType: function (value) {
                type = value;
            },
            $get: function ($http) {
                var self = this;

                $http.get("../../config/client.json").success(function (data) {

                    self.site = data;
                })

                return {
                    ready: function (callback) {
                        var self = this;
                        if (this.site === undefined) {
                            $http.get("../../config/client.json").success(function (data) {

                                self.site = data;
                                callback();
                            })
                        } else {
                            callback();
                        }

                    },
                    site: self.site
                };
            }
        };
    })
    .provider('$Theme', [function () {


        this.$get = function () {


            return {
                setTheme: function (theme) {
                    this.theme = theme;
                },
                getTheme: function () {
                    return this.theme;
                },

            }
        }
    }])
    .factory('$Status', [function () {
        return function () {
            return [{ id: 1, name: "Air" }, { id: 2, name: "Edit" }];
        }
    }])
    .provider('$Screensize', [function () {


        this.$get = function () {


            return {
                height: function () {
                    return $(window).height() - 100;
                }

            }
        }
    }])
    .controller('shellController', function ($scope, $mdDialog, $resource, $location, $compile, $Alerts, $Language, $Theme, $User, $Models, $Cache, $Config, $IDE, $nodulus) {







        $scope.$Alerts = $Alerts;
        $scope.$IDE = $IDE;
        $scope.$nodulus = $nodulus;
        nodulus = $scope.$nodulus;

        $Cache.ready("schemas", function (data) {
            var schemasObject = {};
            for (var i = 0; i < data.length; i++) {
                schemasObject[data[i].name] = data[i];
            }
            $Cache.setCache("schemasByName", schemasObject);
        })
        $scope.$User = $User;
        //$Models.getSchemas();
        var theme = localStorage.getItem("theme");

        if (theme === null)
            theme = "paper";


        $Theme.setTheme(theme);
        //$scope.Theme = theme;


        if (theme !== undefined) {
            var themelink = "themes/" + theme + "/bootstrap.min.css";
            $('link[id="mainthemefile"]').attr('href', themelink);
            localStorage.setItem("theme", theme);
        }


        $scope.PaneHeight = $(window).height() - 110;
        window.onresize = function () {
            $scope.PaneHeight = $(window).height() - 110;
            $scope.$apply($scope.PaneHeight);
        };


        var lcid = localStorage.getItem("lcid");
        $scope.Language = $Language.getByLCID(lcid);
        $Language.set($scope.Language)
            .$promise.then(function (response) {

                var resourceSetResolves = {};
                var arr = angular.fromJson(response.Results);
                if (arr !== undefined) {
                    for (var i = 0; i < arr.length; i++) {

                        resourceSetResolves[arr[i].Key] = arr[i].Value;
                    }
                }
                //$scope.DataTables = data.Tables;
                $scope.LNG = resourceSetResolves;


            });
        $scope.Module = {};
        $scope.initSocketEvents = function () {
            $Config.ready(function () {
                if (!socketsInitialized && typeof (io) !== "undefined") {
                    socket = io(location.origin);

                    if ($User.User !== null)
                        if ($User.User._id)
                            socket.emit('console connect', { UserId: $User.User._id });


                    socket.on('console connected', function (navData) {
                        $scope.$apply(function () {
                            $scope.$Alerts.add({ type: 'success', msg: 'client connected', autoClose: 1000 * 5, 'icon': 'fa fa-check' });
                        });
                    });
                }
            });
        }

        $scope.initSocketEvents();

        $scope.LoadSettingsPage = function () {
            $IDE.ShowLobby({ "_id": "settings", "label": "Settings" }, "partials/settings.html");
        }
        $scope.LoadModulesPage = function () {
            $IDE.ShowLobby({ "_id": "modules", "label": "Modules" }, "@nodulus/modules/modules.html");
        }


        $resource("nodulus.json").get({}, function () { }, function () {

            $location.url("/setup");
        });


    })
    .controller('loginController', function ($scope, $resource, $location, $mdToast, $animate, $mdDialog, $Theme, $User) {


        $scope.$Theme = $Theme;
        if (localStorage.getItem("ApiUser") !== undefined) {
            logedinuser = JSON.parse(localStorage.getItem("ApiUser"));
            if (logedinuser != null && logedinuser !== undefined) {
                $location.path("/manage");
            }



            $mdDialog.show({
                controller: function ($scope, $resource, $mdToast, $location) {
                    $scope.Login = function () {

                        if ($scope.LoginForm.$dirty && $scope.LoginForm.$invalid)
                            return;


                        $scope.LoginLoading = true;
                        var LoginResource = $resource('@nodulus/users/login/', { Email: "@email", Password: "@password" });

                        LoginResource.save({ Email: $scope.Username, Password: $scope.Password }, function (data) {
                            $scope.LoginLoading = false;


                            if (data != null && data.error === undefined) {
                                $mdDialog.cancel();


                                $User.set(data);

                                //localStorage.setItem("ApiUser", JSON.stringify(data));
                                $location.path("/manage");
                            } else {
                                $mdToast.show({
                                    template: '<md-toast>Incorrect user name or password.</md-toast>',
                                    hideDelay: 2000,
                                    position: "bottom"
                                });
                            }
                        });


                    }

                },

                templateUrl: 'partials/manage/dialogs/login.html'

            });


        }
        $scope.Email = "";
        $scope.Password = "";
        $scope.CookieTimeOut = 0;
        $scope.LoginLoading = false;
        $scope.Login = function () {

            if ($scope.LoginForm.$dirty && $scope.LoginForm.$invalid)
                return;


            $scope.LoginLoading = true;
            var LoginResource = $resource('@nodulus/users/Login/', { Email: "@email", Password: "@password" });

            LoginResource.get({ Email: $scope.Username, Password: $scope.Password }, function (data) {
                $scope.LoginLoading = false;
                if (data != null && data._id !== undefined) {
                    localStorage.setItem("ApiUser", JSON.stringify(data));
                    $location.path("/manage");
                } else {
                    $mdToast.show({
                        template: '<md-toast>Incorrect user name or password.</md-toast>',
                        hideDelay: 2000,
                        position: "bottom"
                    });
                }
            });


        }


    })
    .controller('registerController', function ($scope, $resource, $location, $mdToast, $animate, $mdDialog) {


        var regDialog = $mdDialog.show({
            controller: function ($scope, $resource, $mdToast, $location) {
                $scope.Register = function () {
                    if ($scope.RegisterForm.$dirty && $scope.RegisterForm.$invalid)
                        return;


                    $scope.RegisterLoading = true;
                    var RegisterResource = $resource('@nodulus/users/register/', { Email: "@email", Password: "@password" });

                    RegisterResource.save({ Email: $scope.Username, Password: $scope.Password }, function (data) {
                        $scope.RegisterLoading = false;
                        if (data != null && data._id !== undefined) {
                            localStorage.setItem("ApiUser", JSON.stringify(data));
                            $mdDialog.hide();
                            $location.path("/manage");
                        } else {
                            $mdToast.show({
                                template: '<md-toast>' + data.error.message + '</md-toast>',
                                hideDelay: 2000,
                                position: "bottom"
                            });
                        }
                    });


                }

            },

            templateUrl: 'partials/manage/dialogs/register.html'

        });


        $scope.Email = "";
        $scope.Password = "";
        $scope.CookieTimeOut = 0;
        $scope.LoginLoading = false;


    })
    .service('$User', function ($resource, $Config) {

        var instance = this;


        this.set = function (user) {
            user.Password = null;
            localStorage.setItem("ApiUser", JSON.stringify(user));
            instance.user = user;

        }

        this.get = function () {

            var user = localStorage.getItem("ApiUser");
            if (user === undefined)
                return false;
            else
                return JSON.parse(user);


        }


        this.User = this.get();


        this.ready = function (callback) {
            if (instance.Patients !== undefined) {
                callback();
            }
            else {
                this.LoadPatients(callback);

            }
        }

    })
    .service('$Alerts', function ($resource, $Config, $timeout) {


        var instance = this;
        instance.alerts = [];


        this.add = function (alert) {
            instance.alerts.push(alert);
            if (alert.autoClose) {
                $timeout(function () { instance.remove(alert); }, alert.autoClose);
            }


        }
        this.remove = function (alert) {
            instance.alerts.splice(instance.alerts.indexOf(alert), 1);
        }


    })


    .service('$nodulus', function ($resource, $Config, $injector, $log) {

        var instance = this;


        this.register = function (registerModules) {

            //$injector, providersx,
            var i, ii, k, invokeQueue, moduleName, moduleFn, invokeArgs, provider;
            if (registerModules) {
                var runBlocks = [];
                for (k = registerModules.length - 1; k >= 0; k--) {
                    moduleName = registerModules[k];
                    regModules.push(moduleName);
                    moduleFn = angular.module(moduleName);
                    DynamicData.requires.push(moduleName);


                    runBlocks = runBlocks.concat(moduleFn._runBlocks);
                    try {
                        for (invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
                            invokeArgs = invokeQueue[i];

                            if (providers.hasOwnProperty(invokeArgs[0])) {
                                provider = providers[invokeArgs[0]];
                            } else {
                                return $log.error("unsupported provider " + invokeArgs[0]);
                            }
                            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                        }
                    } catch (e) {
                        if (e.message) {
                            e.message += ' from ' + moduleName;
                        }
                        $log.error(e.message);
                        throw e;
                    }
                    registerModules.pop();
                }
                angular.forEach(runBlocks, function (fn) {
                    $injector.invoke(fn);
                });
            }
            return null;
        }


    })
    .directive('navLoader', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                "navname": "=",
                "module": "="

            },
            link: function (scope, elem, attrs) {

                var htm = '<div>' + '<' + scope.navname + '></' + scope.navname + '></div>';
                var compiled = $compile(htm)(scope);
                elem.append(compiled);

            }
        }
    })
    .controller('setupController', ['$scope', '$uibModal', function ($scope, $uibModal) {
        var app = this;

        app.closeAlert = function () {
            app.reason = null;
        };

        app.open = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'setup/partials/wizard.html',
                controller: 'ModalCtrl'

            });

            modalInstance.result
                .then(function (data) {
                    app.closeAlert();
                    app.summary = data;
                }, function (reason) {
                    app.reason = reason;
                });
        };

        app.open();
        $scope.app = app;


    }])
    .controller('ModalCtrl', ['$scope', '$location', '$uibModalInstance', '$Language', '$Theme', '$translate', '$resource', function ($scope, $location, $uibModalInstance, $Language, $Theme, $translate, $resource) {
        var modal = {};


        modal.steps = ['Welcome', 'Persistence mode', 'Admin credentials'];
        modal.step = 0;



        modal.isFirstStep = function () {
            return modal.step === 0;
        };

        modal.isLastStep = function () {
            return modal.step === (modal.steps.length - 1);
        };

        modal.isCurrentStep = function (step) {
            return modal.step === step;
        };

        modal.setCurrentStep = function (step) {
            modal.step = step;
        };

        modal.getCurrentStep = function () {
            return modal.steps[modal.step];
        };

        modal.getNextLabel = function () {
            return (modal.isLastStep()) ? 'Submit' : 'Next';
        };

        modal.handlePrevious = function () {
            modal.step -= (modal.isFirstStep()) ? 0 : 1;
        };

        modal.handleNext = function () {

            if (modal.isLastStep()) {
                if (modal.database && (modal.database.diskdb !== "" || modal.database.mongodb != "")) {



                    //persist settings
                    var resource = $resource("/nodulus/setup");
                    resource.save(modal, function (result) {

                        $location.url("/login");

                    })



                    $uibModalInstance.close(modal.wizard);
                }
                else {
                    modal.step = 1;

                }



            } else {


                modal.step += 1;
            }
        };

        modal.dismiss = function (reason) {
            $modalInstance.dismiss(reason);
        };









        modal.Languages = $Language.languages;
        modal.Language = $Language.getByLCID(localStorage.getItem("lcid"));
        if (modal.Language !== undefined && modal.Language.direction == 'rtl') {
            $('link[id="languageCssfile"]').attr('href', "styles/bootstrap.rtl.css");
        }

        modal.SetLanguage = function () {
            $Language.set(modal.Language).$promise.then(function (response) {
                $translate.use(modal.Language.shortname);
                $translate.preferredLanguage(modal.Language.shortname);
                $translate.fallbackLanguage(modal.Language.shortname);
                $translate.refresh();
                localStorage.setItem("lcid", modal.Language.lcid);
                if (modal.Language !== undefined && modal.Language.direction == 'rtl') {
                    $('link[id="languageCssfile"]').attr('href', "styles/bootstrap.rtl.css");
                } else {

                    if ($Theme.theme !== undefined) {
                        var themelink = "themes/" + $Theme.theme + "/bootstrap.min.css";
                        $('link[id="languageCssfile"]').attr('href', themelink);

                    }
                }
            });
        }

        modal.Theme = $Theme.theme;

        modal.Themes = ["amelia", "blooming", "cerulean", "desert", "paper", "green", "readable", "simplex", "spacelab", "Liquorice Schnitzel", "flat", "cyborg", "United", "superhero", "journal", "Lumen"];
        var theme = localStorage.getItem("theme");
        if (theme !== null && theme !== undefined) {
            modal.Theme = theme;
        }
        else {
            modal.Theme = "paper";
        }

        $scope.$watch("modal.Theme", function (theme_name, oldVal) {
            if (theme_name !== undefined) {
                var theme = "themes/" + theme_name + "/bootstrap.min.css";
                $('link[id="mainthemefile"]').attr('href', theme);
                localStorage.setItem("theme", theme_name);
            }
        });
        $scope.modal = modal;

    }]);


DynamicData.filter("filterpicker", function ($filter) {
    return function (value, filterName) {
        return $filter(filterName)(value);
    };
});
DynamicData.filter("text", function ($) {
    
    return function (input, current) {
        
        return input;
    };
});

DynamicData.controller('Directives.BaseController', ['$scope', '$rootScope', '$Models', '$Broker', '$Cache', function ($scope, $rootScope, $Models, $Broker, $Cache) {
    $scope.Admin = $scope.$root.Admin;
    $scope.cahce = $Cache;

    $scope.$Broker = $Broker;

    $scope.ApplyData = function () {

        $scope.model = $scope.FieldName;


        if ($rootScope.models === undefined)
            $rootScope.models = {};


        if ($Models.Models[$scope.db._id] !== undefined) {//&& $Models[$scope.tab.id][$scope.FieldName] !== undefined
            $scope.ComplexType = $Models.ResolvePropertyValue($scope.FieldName, $scope.db._id, $scope.tab);
        }
        else
            $scope.ComplexType = {};
        if ($scope.dataId !== undefined)
            $scope.ComplexType.input = $scope.$Broker.Objects[$scope.schemaName + "_" + $scope.dataId][$scope.FieldName];
        if ($scope.ComplexType !== undefined) {
            $scope.$watch("ComplexType", function (newVal, oldVal) {


                $scope.$Broker.set($scope.schemaName, $scope.dataId, $scope.FieldName, newVal);


            }, true);

        }


    }

}]);




$(document).bind('keydown', function (e) {
    if (e.ctrlKey && (e.which == 83)) {
        e.preventDefault();

        return false;
    }
});

(function () { angular.module("m43nu.auto-height", []).directive("autoHeight", ["$window", "$timeout", function (n, e) { return { link: function (t, r, i) { var u, a; return u = function (n) { var e, t, r, i; for (e = 0, t = 0, r = n.length; r > t; t++) i = n[t], e += i.offsetHeight; return e }, a = function (n) { var e, t, r, i, u; for (i = n.parent().children(), u = [], t = 0, r = i.length; r > t; t++) e = i[t], e !== n[0] && u.push(e); return u }, angular.element(n).bind("resize", function () { var e, t; return e = i.additionalHeight || 0, t = n.innerHeight - r.parent()[0].getBoundingClientRect().top, r.css("height", t - u(a(r)) - e + "px") }), e(function () { return angular.element(n).triggerHandler("resize") }, 1e3) } } }]) }).call(this);
DynamicData
.directive('metaData', function (RecursionHelper, $compile) {
    return {
        restrict: 'E',
        templateUrl: 'partials/DirectivesTemplates/metaData.html'
        }
    })

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
            var tabwrapper = $("<div></div>");
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



            var refresh_delegate = angular.element("#" + tab.itemKey + " div[ng-controller]").scope().refresh;
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

        $scope.Themes = ["amelia", "blooming", "cerulean", "desert", "paper", "green", "readable", "simplex", "spacelab", "Liquorice Schnitzel", "flat", "cyborg", "United", "superhero", "journal", "Lumen"];
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

        var TreeResource = $resource("/@nodulus/modules/listnav");
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

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
angular.module("Cache", []).
service('$Cache', function ($resource, $Config) {
    
    var instance = this;
    var apiUrl = "@nodulus/api/";
    this.setState = function (collectionName, state) {
        if (this.states[collectionName] === undefined) {
            this.states[collectionName] = { callbacks: [], status: state };
        }
        else {
            this.states[collectionName].state = state;
        }
    }
    
    this.states = {};
    
    this.ready = function (collectionName, arrids, callback) {
        
        //if (this[collectionName] === undefined)
        //    this[collectionName] = {};
        //roi
        if (this.states[collectionName] === undefined) {
            this.states[collectionName] = { callbacks: [], status: 'empty' };
        }
        
        if (isFunction(arrids)) {
            callback = arrids;
            switch (this.states[collectionName].status) {
                case 'empty':
                    this.states[collectionName].status = 'loading';
                    var genres = $resource(apiUrl + collectionName);
                    genres.get({}, function (data) {

                        if (data != null && data.items)
                        {
                            var col = {};
                            for (var i = 0; i < data.items.length; i++) {
                                col[data.items[i]["_id"]] = data.items[i];
                            }

                            instance[collectionName] = col;
                            instance.states[collectionName].status = 'ready';
                            callback(toArray(instance[collectionName]));
                            for (var i = 0; i < instance.states[collectionName].callbacks.length; i++)
                                instance.states[collectionName].callbacks[i](toArray(instance[collectionName]));

                        }
                      
                    });
                    
                    break;
                case 'loading':
                    this.states[collectionName].callbacks.push(callback);
                    
                    break;
                case 'ready':
                    
                    callback(toArray(instance[collectionName]));
                    break;
            }
           

            
        }
        else {
            if (this[collectionName] === undefined)
                this[collectionName] = {};
            
            
            var finalItemList = [];
            for (var i = 0; i < arrids.length; i++) {
                if (this[collectionName][arrids[i]] !== undefined) {
                    finalItemList.push(this[collectionName][arrids[i]]);
                }
            }
            for (var i = 0; i < finalItemList.length; i++) {
                var index = arrids.indexOf(finalItemList[i]._id);
                if (index > -1)
                    arrids.splice(index, 1);
               
            }
            
            if (arrids.length == 0)
                callback(finalItemList);
            
            
            
            
            for (var i = 0; i < arrids.length; i++) {
                var genres = $resource(apiUrl + collectionName);
                genres.get({ "_id": arrids[i] }, function (data) {
                    var col = {};
                    for (var x = 0; x < data.items.length; x++) {
                        instance[collectionName][data.items[x]["_id"]] = data.items[x];
                        finalItemList.push(data.items[x]);
                    }
                    
                    if (arrids.length === i)
                        callback(finalItemList);
                });
                    
                
                
                
            }
        }
    }

    this.setCache = function (collectionName, obj) {
        this.states[collectionName] = { state : 'ready' };
        this[collectionName] = obj;
    
    }


})

.service("$Models", ['$resource', '$rootScope', function ($resource, $rootScope) {
        
        this.Models = {};
        var dbApi = $resource(apiUrl + 'schemas');
        this.getSchemas = function (id) {
            dbApi.get({ "_id": id }, function (data) {
                this.db = data.items[0];
                $rootScope = data.items[0];
            }, function (data) {
                console.log("error");
            })
        }
        
        this.getSchemasByName = function (name, callback) {
            dbApi.get({ "name": name }, function (data) {
                
                this.db = data.items[0];
                $rootScope = data.items[0];
                callback(data.items[0]);
            }, function (data) {
                console.log("error");
            })
        }
        
        this.ResolvePropertyValue = function (strKey, obj, tabs) {
            
            
            var tt = strKey.split('.');
            var curProp = {};
            if (this.Models[obj])
                return assign(this.Models[obj], tt, {});
        }
        
        function assign(obj, keyPath, value) {
            lastKeyIndex = keyPath.length - 1;
            
            for (var i = 0; i < lastKeyIndex; ++i) {
                
                key = keyPath[i];
                if (!(key in obj))
                    obj[key] = {}
                obj = obj[key];
            }
            if (obj[keyPath[lastKeyIndex]] === undefined)
                return obj[keyPath[lastKeyIndex]] = value;
            else
                return obj[keyPath[lastKeyIndex]];
        }
        
        this.Set = function (modelId, key, value) {
            
            if (this.Models[modelId] === undefined) {
                this.Models[modelId] = {};
            }
            var tt = key.split('.');
            var curProp = this.Models[modelId];
            for (var i = 0; i < tt.length; i++) {
                curProp[tt[i]] = {};
                
                if (i < tt.length - 1)
                    curProp = curProp[tt[i]];
                else
                    curProp[tt[i]] = value;
            }
        }
    }])

.service('$Broker', function ($resource, $Config, $Models) {
    var instance = this;
    instance.Models = $Models;
    this.Objects = {};
    this.get = function () {
        for (var key in this.Objects) {
            return this.Objects[key];
        }
    }
    this.ready = function (colName, id , callback) {
        var res = $resource(apiUrl + colName);
        
        res.get({ "_id": id }, function (data) {
            
            
            if (data.items.length > 0) {
                instance.Objects[colName + "_" + id] = revive(data.items[0]);
            }
            else {
                instance.Objects[colName + "_" + id] = { _id: id };
            }
            
            
            callback(instance.Objects[colName + "_" + id]);

        });
    }
    
    function revive(obj) {            
        for (var key in obj) {            
            if (angular.isObject(obj[key]))
                revive(obj[key]);
            else
                obj[key] = reviveType(obj[key]);
        }
        return obj;
    }
    
    
    
    this.set = function (modelName, id, key, value) {
        var modelKey = modelName + "_" + id;
        if (this.Objects[modelKey] === undefined) {
            this.Objects[modelKey] = {};
        }
        var tt = key.split('.');
        var curProp = this.Objects[modelKey];
        for (var i = 0; i < tt.length; i++) {
            curProp[tt[i]] = {};
            
            if (i < tt.length - 1)
                curProp = curProp[tt[i]];
            else
                curProp[tt[i]] = value;
        }
    }

})



function toArray(obj) {
    var arr = [];
    for (var key in obj) {
        arr.push(obj[key]);
    }
    return arr;

}
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


function reviveType(value) {
    var match = null;
    if (typeof value === "string" && (match = value.match(regexIso8601))) {
        var milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
            return new Date(milliseconds);
        }
    }
    return value;
}


var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;


//touch

angular.module('DynamicDataSerivces', [])
.service("$Models",['$resource','$rootScope', function ($resource,$rootScope) {
    
     
    
        this.Models = {};
        var dbApi = $resource('@nodulus/api/schemas');
        this.getSchemas = function (id){
            dbApi.get({ "_id": id }, function (data) {
                this.db = data.items[0];
                $rootScope = data.items[0];
            }, function (data) {
                console.log("error");
            })
        }

    this.ResolvePropertyValue = function (strKey, obj, tabs) {
        
         
        var tt = strKey.split('.');
        var curProp = {};
        if (this.Models[obj])
            return assign(this.Models[obj], tt, {});
    }
    
    function assign(obj, keyPath, value) {
        lastKeyIndex = keyPath.length - 1;
        
        for (var i = 0; i < lastKeyIndex; ++i) {
            
            key = keyPath[i];
            if (!(key in obj))
                obj[key] = {}
            obj = obj[key];
        }
        if (obj[keyPath[lastKeyIndex]] === undefined)
            return obj[keyPath[lastKeyIndex]] = value;
        else
            return obj[keyPath[lastKeyIndex]];
    }
    
    this.Set = function (modelId, key, value) {
        
        if (this.Models[modelId] === undefined) {
            this.Models[modelId] = {};
        }
        var tt = key.split('.');
        var curProp = this.Models[modelId];
        for (var i = 0; i < tt.length; i++) {
            curProp[tt[i]] = {};
            
            if (i < tt.length - 1)
                curProp = curProp[tt[i]];
            else
                curProp[tt[i]] = value;
        }
    }

}])

angular.module("IDE", [])

.service("$IDE", ['$resource', '$rootScope','$compile', function ($resource, $rootScope, $compile) {
        var instance = this;
        this.ActiveTreeNode = {};
        this.Tabs = [];
        this.TabsObject = {};
        
        
        this.setDirty = function (itemKey) {

            this.TabsObject[itemKey].dirty = true;
        }
        this.clearDirty = function (itemKey) {
            this.TabsObject[itemKey].dirty = false;
        }
        
        this.ShowLobby = function (item, itemUrl) {
          
            instance.ActiveTreeNode = item;
            
            if (item == null)
                return;
            //if(item.Url === "" || item.Url === undefined)
            //     item.Url = "lobby.html";
            
            
            
            if (item.label !== undefined)
                item.name = item.label;

            if (item.itemKey === undefined)
                item.itemKey = "b" + "_" + item._id;//.replace(/-/g, '');
            //item.itemKey = itemKey;
            if (instance.TabByKey(item.itemKey) != null) {
                
                instance.focusMe(item.itemKey);
                return;
            }
            
            item.disabled = false;
            item.style = "lobby-tab";
           
            
            
            
            //item.Url = "schemas.html";
            
             

            var tabPane = $("<div id='"+ item.itemKey+"' data-any-lobby=\"" + itemUrl + "\" itemkey='" + item.itemKey + "' schemaid='" + item.schemaid + "'></div>");
           var tabwrapper = $("<div></div>");
            tabwrapper.append(tabPane);
            $("#TabContainer").append(tabwrapper);
            // item.tabPane = tabPane;
            var element = angular.element(tabPane);
            instance.Tabs.push(item);
            instance.TabsObject[item.itemKey] = item;
             
            
            var tabScope = element.scope();
            //var tabScope = $scope.$new(true);
            tabScope.item = item;
            $compile(tabwrapper.contents())(tabScope);
            instance.focusMe(item.itemKey);


        }

        this.focusMe = function (itemKey) {
            $("div[data-egen-page], div[data-egen-lobby],div[data-any-lobby]").hide();             
            $("div[itemkey='" + itemKey + "']").show();           
            
            for (var i = 0; i < instance.Tabs.length; i++)
                if (instance.Tabs[i].itemKey == itemKey) {
                    instance.selectedTabIndex = i;
                    instance.ActiveTreeNode = instance.Tabs[i];
                }





        //$("paper-tab.selected").removeClass("selected");
        //$("paper-tab[itemkey='" + itemKey + "']").addClass("selected");
        }
        
        this.CloseTab = function (tab) {
            
            
            $("div[itemkey = '" + tab.itemKey + "']").remove();
            // tab.tabPane = null;
            
            for (var i = 0; i < instance.Tabs.length; i++)
                if (instance.Tabs[i].itemKey === tab.itemKey) {
                    instance.Tabs.splice(i, 1);
                    var nextpos = i;
                    if (i > 1)
                        nextpos = i - 1;
                    else if (instance.Tabs.length === 1)
                        nextpos = 0;
                    
                    if (instance.Tabs[nextpos] !== undefined)
                        instance.focusMe(instance.Tabs[nextpos].itemKey);
                }

        }
        

        this.onTabSelected = function (tab, $event) {
            instance.focusMe(tab.itemKey);
            
            if ($event) {
                if ($event.which == 2)
                    instance.CloseTab(tab);
            } else {
                if ($event.button == 4)
                    instance.CloseTab(tab);
            }



        //tab.Selected = true;
        }
        
        this.TabByKey = function (itemKey) {
            for (var i = 0; i < this.Tabs.length; i++)
                if (this.Tabs[i].itemKey == itemKey)
                    return this.Tabs[i];
            return null;

        }
    
    }]);
