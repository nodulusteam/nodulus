DynamicData
    .directive('metaData', ['RecursionHelper', '$compile', function (RecursionHelper, $compile) {
        return {
            restrict: 'E',
            templateUrl: 'partials/DirectivesTemplates/metaData.html'
        }
    }]);
