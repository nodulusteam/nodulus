DynamicData
.directive('nosqlRender', function (RecursionHelper, $compile) {
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
                     //debugger
                    
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
            


        },
    }
})

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};