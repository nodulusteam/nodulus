




angular.module('scripter', [])
.directive("scripterNav", function ($compile, $mdBottomSheet, $mdDialog) {
    return {
        restrict: 'E',
        controller: function ($scope, $resource) {
            
            $scope.menu = {
                id: 3, 'name': 'Scripter',
                icon: 'fa fa-database' , 
                'type': 'scripter',
 
            }
            
            
        

        },
        templateUrl: "modules/scripter/nav.html",
        link: function (scope, element, attrs) {
                
        }
    };
})
.directive("blockGallery", function ($compile, $mdBottomSheet, $mdDialog) {
    return {
        restrict: 'E',
        controller: function ($scope, $resource) {
            
           
            
            
        

        },
        templateUrl: "modules/scripter/block-gallery.html",
        link: function (scope, element, attrs) {
            
            }
    };
});














var pipelineApp = angular.module('scripter')



.directive('required', function ($compile) {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model 
            
            
            
            scope.$on('submitform', function (event, args) {
                
                if (event.targetScope == event.currentScope) {
                    if (ngModel.$error["required"]) {
                        element.parent().addClass("has-error");
                    }
                    else {
                        element.parent().removeClass("has-error");
                    }
                }
            });


            //$(element).on("validate", function () {                 
            //    alert(ngModel.$error["required"]);                 
            //});
        }



        //ctrl.$setValidity('validNumber', false);
        //scope.watch(angular.element(element).$error.required, function () {
        //    alert("ddd");
        //})


        //        scope.$watch(
        //function (scope) {

        //    var d = $(element).data("macros");
        //    if (d !== undefined && d != null && d.length > 0) {
        //        $(element).parent().find(".clearmacroBtn").css("display", "inline-block");
        //        MacroPaint(null, element);
        //    }
        //    else {
        //        $(element).parent().find(".clearmacroBtn").hide();

        //    }
        //    return scope.$eval(attrs.compile);
        //},
        //function (value) {

        //    element.html(value);
        //    $compile(element.contents())(scope);
        //});






    };
})

.directive('simplemacro', function ($compile) {
    return function (scope, element, attrs) {
        //$(element).wrap("<div class='input-group'></div>");
        $(element).before("<span class='form-control hidden input-sm'></span>");
        
        
        scope.$watch(
            function (scope) {
                
                var d = $(element).data("macros");
                if (d !== undefined && d != null && d.length > 0) {
                    $(element).parent().find(".clearmacroBtn").css("display", "inline-block");
                    MacroPaint(null, element);
                }
                else {
                    $(element).parent().find(".clearmacroBtn").hide();

                }
                return scope.$eval(attrs.compile);
            },
function (value) {
                
                element.html(value);
                $compile(element.contents())(scope);
            });
        
        
        var exp = scope.expression;
        
        
        
        
        if (exp.Macros !== undefined && exp.Macros != null && exp.Macros[$(element).attr("rel")] !== undefined && exp.Macros[$(element).attr("rel")] != null) {
            $(element).attr("disabled", true);
            
            MacroPaint(null, element);
            
            var data = exp.Macros[$(element).attr("rel")];
            //var strmacro = "{";
            //var mcount = 0;

            //for (var i = 0; i < data.length; i++) {
            //    var macro = MacrosDictionaryDataSource[data[i]];
            //    if (macro != null)
            //        strmacro += macro.Name + ",";
            //    mcount++;
            //}

            //if (mcount > 0) {
            //    strmacro = strmacro.substring(0, strmacro.length - 1);
            //    strmacro += "}";

            //    var tname = $(element)[0].tagName;
            //    if (tname == "INPUT") {
            //        $(element).val(strmacro);
            //    }
            //    else {

            //        $(element).prepend($('<option selected class="macrobind">' + strmacro + '</option>'));


            //    }
            //    $(element).attr("title", strmacro);
            //    $(element).data("macros", exp.Macros[$(element).attr("rel")]);
            //}
            //else {
            //    $(element).attr("disabled", false);
            //    $(element).val("");
            //}
        }
        
        
        var cs = "style='display: none'";
        if (data !== undefined && data.length > 0)
            cs = "";
        
        
        var group = $("<span class='input-group-btn resize-buttons'></span>");
        
        
        $(group).append("<a class='clearmacroBtn  btn btn-info btn-sm'  ng-click='ClearInputMacros($event, block)'><span class='glyphicon glyphicon-retweet'></span></a>");
        $(group).append("<a class='btn btn-info btn-sm' ng-click='OpenSelectMacro($event, block)'><span class='glyphicon glyphicon-tags'></span></a>");
        
        if ($(element).hasClass("blockbrowser")) {
            $(element).data("blockbrowser", true);
            
            $(group).append("<a class='selectElementBtn btn btn-info btn-sm'><span class='glyphicon glyphicon-map-marker'></span></a>");
        }
        
        
        $(group).find(".glyphicon").height($(element).height() - 1);
        
        $(element).after(group);
        $compile(group)(scope);

    };
})
.directive('enablemacro', function ($compile) {
    return function (scope, element, attrs) {
        
        
        
        
        
        scope.$watch(
            function (scope) {
                
                
                
                var d = $(element).data("macros");
                if (d !== undefined && d != null && d.length > 0) {
                    $(element).parent().find(".clearmacroBtn").css("display", "inline-block");
                    MacroPaint(null, element);
                }
                else {
                    $(element).parent().find(".clearmacroBtn").hide();

                }
                return scope.$eval(attrs.compile);
            },
  function (value) {
                
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);
                
                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            });
        
        
        
        //if it runs in a template just return
        if ($(element).parents(".blockContainer").length == 0)
            return;
        
        
        
        
        
        var modelKey = $(element).attr("ng-model").replace("block.Object.Properties.", "");
        $(element).wrap("<div class='input-group'></div>");
        
        var mcol = null;
        if (scope.block.Object.Macros != null) {
            mcol = scope.block.Object.Macros[modelKey];
            $(element).data("macros", mcol);
            $(element).before("<span class='form-control hidden'></span>");
            
            mcol = MacroPaint(scope.block, element)
        }
        
        //else {
        //    $(this).attr("disabled", false);
        //    $(this).val("");
        //}
        
        var cs = "style='display: none'";
        if (mcol !== null && mcol.length > 0)
            cs = "";
        
        
        var group = $("<span class='input-group-btn resize-buttons'></span>");
        
        
        $(group).append("<a class='clearmacroBtn  btn btn-info'  ng-click='ClearInputMacros($event, block)'><span class='glyphicon glyphicon-retweet'></span></a>");
        $(group).append("<a class='btn btn-info' ng-click='OpenSelectMacro($event, block)'><span class='glyphicon glyphicon-tags'></span></a>");
        
        if ($(element).hasClass("blockbrowser")) {
            $(element).data("blockbrowser", true);
            
            $(group).append("<a class='selectElementBtn btn btn-info'><span class='glyphicon glyphicon-map-marker'></span></a>");
        }
        
        $(group).find(".glyphicon").height($(element).height() - 1);
        
        $(element).after(group);
        
        $compile(group)(scope);

    };
})

.directive('colorbox', function ($compile) {
    return function (scope, element, attrs) {
        
        
        scope.$watch(
            function (scope) {
                
                
                
                
                return scope.$eval(attrs.compile);
            },
  function (value) {
                
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);
                $(element).pickAColor("updatePreview");
                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            });
        
        //if it runs in a template just return
        if ($(element).parents(".blockContainer").length == 0)
            return;







    };
})

.directive('mycontroller', function () {
    return {
        compile: function (tElement, attrs) {
            var div = tElement.find('div');
            div.attr('ng-controller', eval(attrs.mycontroller));
        }
    }
})

.directive('htmleditor', function () {
    return function (scope, element, attrs) {
        CKEDITOR.env.isCompatible = true;
        $(element).ckeditor();

    }
})




.directive('blockbrowser', function () {
    return function (scope, element, attrs) {
        $(element).after("<span class='input-group-btn'><a class='selectElementBtn btn btn-info'><span class='glyphicon glyphicon-map-marker'></span></a></span>");

    }
})
.directive('blocktabs', function ($compile) {
    return function (scope, element, attrs) {
        
        //append additional markup
        var additional = $(element).find(".AdditionalTabs");
        
        $(element).find(".AdditionalTabs > div").each(function (index) {
            var tab = $('<li><a>' + $(this).attr("tabname") + '</a></li>');
            $(element).children("ul").children("li").last().after(tab);
            
            var tabcontent = $(this).clone(true);
            
            var elem = $(element).children(".tab-content").children("div").last().after(tabcontent);
            
            
            tabcontent.hide();
            
            
            $compile(tabcontent.contents())(scope);
        });
        
        
        $(additional).remove();
        
        // $compile(element.contents())(scope);
        $(element).children("ul").children("li").children("a").each(function (index) {
            $(this).attr("tabref", "spec" + index.toString());
        });
        $(element).children(".tab-content").children("div").each(function (index) {
            $(this).attr("tabref", "spec" + index.toString());
        })
        
        
        $(element).children("ul").children("li").children("a").click(function (e) {
            var parentblock = $(this).parents(".blockContainer");
            InitializeCodeBlocks(element);
            State.set(".blockContainer[blockid=\"" + $(parentblock).attr("blockid") + "\"] .blockui.tabs", $(this).attr("tabref"), "settabcallback");

        });
        var parentblock = $(element).parents(".blockContainer");
        
        if (!State.apply(".blockContainer[blockid=\"" + $(parentblock).attr("blockid") + "\"] .blockui.tabs")) {
            State.set(".blockContainer[blockid=\"" + $(parentblock).attr("blockid") + "\"] .blockui.tabs", "spec0", "settabcallback");
        }
        State.apply(".blockContainer[blockid=\"" + $(parentblock).attr("blockid") + "\"]");
    };
})
.directive('bindproperties', function ($compile) {
    return function (scope, element, attrs) {
        var btype = scope.block.Object.Type;
        var typeobj = { 'type': btype, 'id': scope.block.Id };
        $(element).append("<div scripterpipeblock='" + JSON.stringify(typeobj) + "'></div>");
        $(element).append("<div class='clearboth'></div>");
        $compile(element.contents())(scope);
        scope.$watch('block', function (newNames, oldNames) {
            if (oldNames.Gliph === undefined)
                return;
            
            if (oldNames !== newNames) {
                scope.block.IsDirty = true;
                setDirty(scope.block.Id);
            }
        }, true);



    }
});

function GetControllerName(prefix, Id) {
    return prefix + "_" + Id.replace(/-/g, '');

}



Array.prototype.groupByProperties = function (property, idprop) {
    var arr = this;
    var groups = [];
    for (var i = 0, len = arr.length; i < len; i += 1) {
        var obj = arr[i];
        if (groups.length == 0) {
            groups.push({ 'key': obj[idprop], 'value': obj[property] });
        }
        else {
            var equalGroup = false;
            for (var a = 0, glen = groups.length; a < glen; a += 1) {
                var group = groups[a];
                var equal = true;
                var firstElement = group;
                
                
                if (firstElement['key'] !== obj[idprop]) {
                    equal = false;
                }
                
                
                if (equal) {
                    equalGroup = group;
                }
            }
            if (equalGroup) {
                // equalGroup.push(obj);
            }
            else {
                groups.push({ 'key': obj[idprop], 'value': obj[property] });
            }
        }
    }
    return groups;
};

function MacroPaint(block, element) {
    
    var mcol = $(element).data("macros");
    
    if (mcol !== undefined && mcol != null) {
        $(element).attr("disabled", true);
        
        
        var strmacro = "{";
        var mcount = 0;
        
        for (var i = 0; i < mcol.length; i++) {
            var macro = MacrosDictionaryDataSource[mcol[i]];
            if (macro != null)
                strmacro += macro.Name + ",";
            mcount++;
        }
        
        if (mcount > 0) {
            strmacro = strmacro.substring(0, strmacro.length - 1);
            strmacro += "}";
            
            var tname = $(element)[0].tagName;
            if (tname == "INPUT") {
                $(element).hide();
                $(element).prev("span").html(strmacro).removeClass("hidden");
            }
            else {
                $(element).hide();
                $(element).prev("span").html(strmacro).removeClass("hidden");
                //$(element).val(strmacro);
                //$(element).prepend($('<option selected value="' + strmacro + '" class="macrobind">' + strmacro + '</option>'));


            }
            $(element).attr("title", strmacro);
            //$(element).data("macros", mcol[modelKey]);
        }
        else {
            $(element).attr("disabled", false);
            $(element).val("");
        }
        return mcol;
    }
    else {
        $(element).attr("disabled", false);
        $(element).show();
        $(element).val("");
        $(element).prev("span").html(strmacro).addClass("hidden");
    }
    return null;

}