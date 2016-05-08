angular.module("schemaForm").run(["$templateCache", function ($templateCache) { $templateCache.put("directives/decorators/bootstrap/summernote/summernote.html", "<div class=\"content\"><label ng-show=\"showTitle()\">{{ form.title }}</label><summernote ng-show=\"form.key\" schema-validation=\"form\" ng-model=\"$$value$$\"></summernote><span sf-message=\"form.description\" class=\"help-block\"></span></div>"); }]);
(function (angular) {
    'use strict';
    
    angular
      .module('schemaForm')
      .config(configure);
    
    
    function configure(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
        debugger
        schemaFormDecoratorsProvider.addMapping(
            'bootstrapDecorator',
        'summernote',
        'directives/decorators/bootstrap/summernote/summernote.html'
        );
        
        schemaFormDecoratorsProvider.createDirective('summernote', 'directives/decorators/bootstrap/summernote/summernote.html');
        
        var summernote = function (name, schema, options) {
            debugger
            if (schema.type === 'string' && (schema.format === 'format-multiline')) {
                var f = schemaFormProvider.stdFormObj(name, schema, options);
                f.key = options.path;
                f.type = 'summernote';
                
                options.lookup[sfPathProvider.stringify(options.path)] = f;
                return f;
            }
        };
        
        schemaFormProvider.defaults.string.unshift(summernote);

    }
    configure.$inject = ["schemaFormProvider", "schemaFormDecoratorsProvider", "sfPathProvider"];

})(angular);