//.directive("dynamic", function ($compile, $parse) {
//    return {
//        restrict: "A",
//        replace: false,
//        transclude: true,
//        link: function ($scope, element, attr) {
//            attr.$observe("dynamic", function (val) {
//                element.html("");
//                //debugger
//                var temp = angular.fromJson(val);
//                var directives = $parse(val)($scope);
//                angular.forEach(directives, function (directive) {
//                    element.append($compile(directive)($scope));
//                });
//            });
//        }
//    }
//})
//   noSqlManager.directive('focusMe', function ($timeout, $parse) {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attrs) {
//             var model = $parse(attrs.focusMe);
//             scope.$watch(model, function (value) {
//                 console.log('value=', value);
//                 $timeout(function () {
//                     element[0].focus();
//                 });
//             });
//             //element.bind('blur', function () {
//             //    console.log('blur')
//             //    scope.$apply(model.assign(scope, false));
//             //})
//         }
//     };
// })

DynamicData.directive('nosqlRender', function (RecursionHelper, $compile) {
    return {
        restrict: 'E',
        templateUrl: 'partials/DirectivesTemplates/noSqlRender.html',
        controller: [
            "$scope", "$controller", "$rootScope", function ($scope, $controller, $rootScope) {
                $controller('Directives.BaseController', { $scope: $scope });
                  
            }],
        
        compile: function (element) {
            return RecursionHelper.compile(element, {
                
                pre: function (scope, element, attr) {
                    
                   
                    scope.dataField = angular.fromJson(attr.data);
                    scope.dataSource = scope.dataField.children;
                    scope.privateFieldName = scope.dataField.name;
                    scope.privateFieldType = scope.dataField.type;
                    
                    
                    if (scope.privateFieldType !== undefined) {
                        
                        var directive = "<egen-{0} fieldname='{1}' label={2}></egen-{0}>".format(scope.privateFieldType, scope.privateFieldName, scope.dataField.label);
                        console.log(directive);
                    }
                    
                    scope.c = $compile(directive)(scope);
                   
                },
                post: function (scope, element, attr) {
                    
                    
                    if (scope.c !== undefined)
                        element.find(".nosqlInput").append(scope.c);
                    else
                        element.find(".nosqlInput").append(scope.property.label);
                        
                }
            })
            

//$compile(el)($scope);

        },
    }
})


