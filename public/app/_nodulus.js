﻿/*                 _       _           
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

console.debug('nodulus_dependecies', nodulus_dependecies);


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


        this.$get = ['$resource', function ($resource) {
            var languageResource = $resource(apiUrl + '/Languages/', { "lcid": "@lcid" });

            return {
                language: null,
                getActive: function () {
                    return this.language;
                },
                resourceSet: null,
                set: function (language) {

                    this.language = language;
                    // less.modifyVars({
                    //     '@direction': language.direction,
                    //     '@align': language.align
                    // });

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
        }];
    }])
    .provider('$DataTable', [function () {
        this.$get = ['$resource', function ($resource) {
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


        }];
    }])
    .provider("$Config", function () {
        var type;
        return {
            setType: function (value) {
                type = value;
            },
            $get: ['$http',  function ($http) {
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
            }]
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
    .controller('shellController', ['$scope', '$mdDialog', '$resource', '$location', '$compile', '$Alerts', '$Language', '$Theme', '$User', '$Models', '$Cache', '$Config', '$IDE', '$nodulus', function ($scope, $mdDialog, $resource, $location, $compile, $Alerts, $Language, $Theme, $User, $Models, $Cache, $Config, $IDE, $nodulus) {







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
            theme = "default";


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


    }])
    .controller('loginController', ['$scope', '$resource', '$location', '$mdToast', '$animate', '$mdDialog', '$Theme', '$User', function ($scope, $resource, $location, $mdToast, $animate, $mdDialog, $Theme, $User) {


        $scope.$Theme = $Theme;
        if (localStorage.getItem("ApiUser") !== undefined) {
            logedinuser = JSON.parse(localStorage.getItem("ApiUser"));
            if (logedinuser != null && logedinuser !== undefined) {
                $location.path("/manage");
            }



            $mdDialog.show({
                controller: ['$scope', '$resource', '$mdToast', '$location', function ($scope, $resource, $mdToast, $location) {
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

                }],

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


    }])
    .controller('registerController', ['$scope', '$resource', '$location', '$mdToast', '$animate', '$mdDialog', function ($scope, $resource, $location, $mdToast, $animate, $mdDialog) {


        var regDialog = $mdDialog.show({
            controller:['$scope', '$resource', '$mdToast', '$location',  function ($scope, $resource, $mdToast, $location) {
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

            }],

            templateUrl: 'partials/manage/dialogs/register.html'

        });


        $scope.Email = "";
        $scope.Password = "";
        $scope.CookieTimeOut = 0;
        $scope.LoginLoading = false;


    }])
    .service('$User', ['$resource', '$Config', function ($resource, $Config) {

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

    }])
    .service('$Alerts', ['$resource', '$Config', '$timeout', function ($resource, $Config, $timeout) {


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


    }])


    .service('$nodulus', ['$resource', '$Config', '$injector', '$log', function ($resource, $Config, $injector, $log) {

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


    }])
    .directive('navLoader', ['$compile', function ($compile) {
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
    }])
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
            modal.Theme = "default";
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


DynamicData.filter("filterpicker", ['$filter', function ($filter) {
    return function (value, filterName) {
        return $filter(filterName)(value);
    };
}]);
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




//$(document).bind('keydown', function (e) {
//    if (e.ctrlKey && (e.which == 83)) {
//        e.preventDefault();

//        return false;
//    }
//});
