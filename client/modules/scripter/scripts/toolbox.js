var ToolBoxPopDialog;
var PipeLine = {};
var RulesDictionaryDataSource = "{}";
var OperatorsJson = "{}";
var MacrosDictionaryDataSource = "{}";
 
    var pipelineApp = angular.module('scripter')    
    .controller('appsController', ['$scope', '$sce', '$compile', '$http', function ($scope, $sce, $compile, $http) {
            $scope.SelectedApp = null;
            $scope.Apps = function (mode) {
                
                switch (mode) {
                    case "free":
                        return BlockInformationFreeDataSource;
                        break;
                    case "premium":
                        return BlockInformationPremiumDataSource;
                        break;
                    case "user":
                        
                        return BlockInformationUsersDataSource;
                        break;
                }
       
            }
            
            
            
            
            
            $http({ method: 'POST', url: "handlers/BlockGallery.aspx/GetScripterComponents", data: { "request": { "ComponentType": "User" } } }).
success(function (data, status, headers, config) {
                $scope.ScripterStockComponents = data.d;
            }).
error(function (data, status, headers, config) {
            });
            
            
            
            $http({ method: 'POST', url: "handlers/BlockGallery.aspx/GetScripterComponents", data: { "request": { "ComponentType": "Premium" } } }).
success(function (data, status, headers, config) {
                $scope.ScripterPremiumComponents = data.d;
            }).
error(function (data, status, headers, config) {
            });
            
            $http({ method: 'POST', url: "handlers/BlockGallery.aspx/GetScripterComponents", data: { "request": { "ComponentType": "User" } } }).
success(function (data, status, headers, config) {
                $scope.ScripterUserComponents = data.d;
            }).
error(function (data, status, headers, config) {
            });
            
            
            
            
            
            $scope.DisplayApp = function (app) {
                
                $scope.SelectedApp = app;
                $sce.trustAsHtml($scope.SelectedApp.MerchantOptions.Description);
                $sce.trustAsHtml($scope.SelectedApp.Description);
                // $sce.trustAsHtml($scope.SelectedApp.MerchantOptions.Settings);
                $sce.trustAsHtml($scope.SelectedApp.MerchantOptions.UsageExamples);
                
                var dataitem = app;
                
                $("#GalleryWelcome").hide();
                $("#BasicItemInfo").hide();
                $("#PremiumItemInfo").hide();
                
                if (dataitem.MerchantOptions.License == 0) {
                    //$("#BasicItemInfo", $(this).parents(".row")).databind({ "dataSource": [dataitem] });
                    $("#BasicItemInfo").show();
                    var element = $("#BasicItemInfo").find("#tab_settings");
                    
                    var typeobj = { 'type': dataitem.CodeName, 'id': '00000000-0000-0000-0000-000000000000' };
                    element.html("<div scripterpipeblock='" + JSON.stringify(typeobj) + "'></div>");
                    
                    var tempscope = $scope.$new();
                    tempscope.block = {};
                    tempscope.block.Object = {};
                    $compile(element.contents())(tempscope);
                    //tempscope.$apply();
                    
                    
                    
                    //$("#BasicItemInfo").find("#tab_settings").html('<div scripterpipeblock=\'{"type":"AddElement","id":"00000000-0000-0000-0000-000000000000"}\'></div>');
                    //$compile(element.contents())(scope);
                    $("#BasicItemInfo").find("a[href='#Overview']").trigger("click");


                }
                else {
                    //$("#PremiumItemInfo", $(this).parents(".row")).databind({ "dataSource": [dataitem] });
                    $("#PremiumItemInfo").show();
                    var element = $("#PremiumItemInfo").find("#ptab_settings");
                    
                    var typeobj = { 'type': dataitem.CodeName, 'id': '00000000-0000-0000-0000-000000000000' };
                    element.html("<div scripterpipeblock='" + JSON.stringify(typeobj) + "'></div>");
                    
                    var tempscope = $scope.$new();
                    tempscope.block = {};
                    tempscope.block.Object = {};
                    $compile(element.contents())(tempscope);
                    
                    $("#PremiumItemInfo").find("a[href='#ptab_Overview']").trigger("click");
                }

          


  
     

            };
            $scope.CreateAddMacroDialog = function () {
  
            }
            
            
            $scope.AddBlock = function (app) {
                var btn = $(event.currentTarget);
                btn.append($('<i class="marg fa glyphicon glyphicon-refresh fa-spin"></i>'));
                
                var dataitem = app;
                
                var key = dataitem.CodeName;
                var versionId = dataitem.Version;
                
                var container = $(this).parents(".toolboxItemContainer");
                $.ajax({
                    type: "POST",
                    url: "handlers/NewBlock.ashx?type=" + key + "&version=" + versionId,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    success: function (data, textStatus, jqXHR) {
                        btn.find('i').remove();
                    debugger
                        ToolBoxPopDialog.close();
                        data.Type = key;
                        data.IsNew = true;
                        data.Object = JSON.parse(data.Object);
                        
                        
                        PipeLine.Blocks.push(data);
                        var scopeblock = angular.element($("#PipeBlocksBox")).scope();
                        scopeblock.Refresh();
                        
                        var scopeide = angular.element($("body")).scope();
                        scopeide.Refresh();
                        
                        var index = $(".blockContainer[blockid='" + data.Id + "']").index();
                        data.Index = index;
                        data.Sort = index;
                        setDirty(data.Id);
                    }
                });
            }


 

 

  

        }])
    
    
    .controller('blocksController', ['$scope', '$sce', '$http', '$Alerts', '$IDE', '$translate', '$resource', '$Language', function ($scope, $sce, $http, $Alerts, $IDE, $translate, $resource, $Language) {
            
            
        $scope.PipeLine = {};
        $scope.WebSite = {};

            
            $scope.LNG = function (key) {
                if (LNG["BLOCKS_" + this.block.Object.Type][key] !== undefined)
                    return LNG["BLOCKS_" + this.block.Object.Type][key];
                else
                    return key;

            }
            
            $scope.FilterTypeName = function () { angular.element($("body")[0]).scope().FilterTypeName; }
            
            $scope.Blocks = PipeLine.Blocks;
            
            
            
            $scope.ToArray = function (object) {
                var arr = [];
                for (var x in object) {
                    arr.push(object[x]);
                }
                return arr;

            }
            $scope.Rule = null;
            
            // $scope.EditingRule = null;
            
            $scope.Rules = $scope.ToArray(RulesDictionaryDataSource);
            $scope.RulesOperators = OperatorsJson;
            
            $scope.RulesOperatorsDictionary = {};
            for (var i = 0; i < OperatorsJson.length; i++) {
                $scope.RulesOperatorsDictionary[OperatorsJson[i].Key] = OperatorsJson[i];

            }
            
            
            $scope.Macros = MacrosDictionaryDataSource;
            $scope.MacrosList = function () {
                return $scope.ToArray(MacrosDictionaryDataSource);

            }
            
            $scope.GetRules = function (rulescode) {
                
                if (rulescode == null)
                    return "";
                var usedcode = {};
                var res = [];
                for (var i = 0; i < rulescode.length; i++) {
                    if (!usedcode[rulescode[i]] && RulesDictionaryDataSource[rulescode[i]] !== undefined)
                        res.push(RulesDictionaryDataSource[rulescode[i]]);
                    
                    usedcode[rulescode[i]] = true;
                }
                return res;
            };
            
            
            $scope.NewRule = function () {
                $scope.EditingRule = { Id: EmptyGuid, 'RuleType': 'All', 'UseExisting': false, 'Browsers': {} };
                $("#NewRuleSection").show();
                $scope.CreateRuleDialog($scope.Rule, null);
            }
            
            
            $scope.AddRule = function (block) {
                $scope.EditingRule = { 'RuleType': 'All', 'UseExisting': true, 'Browsers': {} };
                
                $scope.Block = block;
                $("#NewRuleSection").show();
                $scope.CreateRuleDialog($scope.Rule, block);
            }
            
            
            $scope.AddFileRule = function () {
                $scope.EditingRule = { 'RuleType': 'All', 'UseExisting': true, 'Browsers': {} };
                $("#NewRuleSection").show();
                $scope.CreateRuleDialog($scope.Rule, $scope.PipeLine);
            }
            
            $scope.DeleteExpression = function (expression) {
                for (var i = 0; i < $scope.EditingRule.RuleExpressions.length; i++) {
                    if (expression == $scope.EditingRule.RuleExpressions[i])
                        $scope.EditingRule.RuleExpressions.splice(i, 1);
                }
            }
            
            $scope.AddMacro = function (expression) {
                var macrocontroller = angular.element($("#MacroConrollerSection")).scope();
                
                var scope = $("#MacroForm").show();
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_INFO,
                    title: getIcon("flag") + LNG.NewMacro,
                    message: scope,
                    buttons: [{
                            label: LNG.OK,
                            action: function (dialog) {
                                
                                var macro = macrocontroller.Macro;
                                var scope = $(dialog.$modalBody);
                                $.ajax({
                                    type: "POST",
                                    url: "handlers/Macro.aspx?command=UpdateMacro",
                                    data: { "macro": JSON.stringify(macro), "projectId": PipeLine.ProjectId },
                                success: function (msg) {
                                    debugger
                                        macro = JSON.parse(msg);
                                        expression.Macro = macro.Id;
                                        macrocontroller.Macro = macro;
                                        MacrosDictionaryDataSource[macro.Id] = macro;
                                        $scope.Macros = MacrosDictionaryDataSource;
                                        
                                        $scope.$apply($scope.Macros);
                                        
                                        $scope.$apply(macrocontroller.Rule);
                                        dialog.close();
                                    }
                                });



                    //   setDirty();
                            }

                        }]
                });









            }
            
            $scope.DeleteRule = function (rule) {
                
                var ruleid = rule.Id;
                
                BootstrapDialog.confirm("are you sure you wish to delete this rule?", function (result, dialog) {
                    if (!result) {
                        dialog.close();
                        return;
                    }
                    delete RulesDictionaryDataSource[ruleid];
                    
                    $.ajax({
                        type: "POST",
                        url: "handlers/Rule.aspx?command=DeleteRule",
                        data: { "ruleid": ruleid },
                        success: function (msg) {
                            dialog.close();
                            $scope.Rules = $scope.ToArray(RulesDictionaryDataSource);
                            $scope.$apply($scope.Rules);
                        }
                    });

                });
            }
            
            $scope.EditRule = function (rule, block) {
                
                
                $scope.EditingRule = rule;
                if ($scope.EditingRule.Browsers === undefined || $scope.EditingRule.Browsers == null)
                    $scope.EditingRule.Browsers = {};
                
                $scope.Block = block;
                $scope.CreateRuleDialog($scope.EditingRule, block);
            }
            
            $scope.ClearInputMacros = function (event, block) {
                
                var element = $(event.target).parents(".input-group").find("input,select,textarea");
                $(element).data('macros', null);
                
                if (block !== undefined) {
                    var modelKey = $(element).attr("ng-model").replace("block.Object.Properties.", "");
                    if (block.Object.Macros != null && block.Object.Macros[modelKey] !== undefined) {
                        delete block.Object.Macros[modelKey];
                        block.IsDirty = true;
                    }
                    MacroPaint(block, element)
                }
                else {
                    angular.element(element).scope().expression.Macros = [];
                    MacroPaint(null, element);
                }

            }
            
            $scope.OpenSelectMacro = function (event, block) {
                
                var input = $(event.target).parents(".input-group").find("input,select,textarea");
                
                ////  var input = $(event.target).parent().prev("input,select");
                //  //if (input.length == 0)
                
                //  var cid = $(this).parents(".blockContainer").attr("blockid");
                //  if (cid !== undefined)
                //      currentblockid = cid;
                
                //  var input = $(this).parents(".input-group").find("input,select,textarea");
                $scope.CreateMacroDialog(input, block);

            }
            
            $scope.CreateMacroDialog = function (input, block) {
                
                
                var controller = angular.element($("#MacroConrollerSection")).scope();
                controller.SetInput(input, block);
                var scope = $("#macros-form").show();
                $("#MacroForm").data("connectedinput", input);
                var macrolist = [];
                var datalist = input.data("macros");
                
                if (datalist !== undefined && datalist != null) {
                    for (var i = 0; i < datalist.length; i++) {
                        macrolist.push(MacrosDictionaryDataSource[datalist[i]]);
                    }
                    
                    
                    $(".delmacro", $(scope)).data("connectedinput", input);

                }
                
                
                
                
                
                BootstrapDialog.show({
                    title: getIcon("flag") + LNG.MacroEditor,
                    message: scope,
                    type: BootstrapDialog.TYPE_WARNING,
                    onhidden: function (dialogRef) {
                        $("#MacroForm", $(dialogRef)).data("connectedinput", null);

                // bindMacroInput(input);
                    },
                    buttons: [{
                            label: LNG.OK,
                            action: function (dialog) {
                                
                                if (block !== undefined) {
                                    block.IsDirty = true;
                                }
                                dialog.close();
                                setDirty();
                            }

                        }]
                });

            }
            
            
            
            
            $scope.RemoveRule = function (rule, objectscope, $event) {
                
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                
                
                BootstrapDialog.confirm(LNG.ConfirmRuleRemove, function (result, dialog) {
                    if (!result)
                        return;
                    
                    dialog.close();
                    
                    if (objectscope.Object !== undefined && objectscope.Object.Rules !== undefined && objectscope.Object.Rules != null) {
                        for (var i = 0; i < objectscope.Object.Rules.length; i++)
                            if (rule.Id == objectscope.Object.Rules[i]) {
                                objectscope.Object.Rules.splice(i, 1);
                                objectscope.IsDirty = true;
                                $scope.$apply(objectscope.Object.Rules);
                                setDirty();
                            }
                    }
                    else {
                        if (objectscope !== undefined && objectscope.Rules !== undefined && objectscope.Rules != null) {
                            for (var i = 0; i < objectscope.Rules.length; i++)
                                if (rule.Id == objectscope.Rules[i]) {
                                    objectscope.Rules.splice(i, 1);
                                    $scope.$apply(objectscope.Rules);
                                    setDirty();
                                }
                        }
                    }
                });

            }
            
            $scope.CreateRuleDialog = function (rule, block) {
                
                // $scope.Rule = rule;
                
                $scope.RuleScope = block;
                var tablecontainer = null;
                
                var dialogScope = $("#rules-form").show();
                
                var pipeBlock;
                
                
                var title = LNG.NewRule;
                if (rule != null && rule.Id != EmptyGuid)
                    title = LNG.EditRule;
                
                
                BootstrapDialog.show({
                    title: getIcon("book") + title,
                    size: BootstrapDialog.SIZE_MEDIUM,
                    message: $("#rules-form"),
                    buttons: [{
                            label: LNG.OK,
                            action: function (dialog) {
                                
                                
                                if (!$scope.EditingRule.UseExisting) {
                                    var btn = this;
                                    if (!$scope.RuleInformationForm.$valid) {
                                        $(btn).find('.fa').remove();
                                        return;
                                    }
                                }
                                
                                
                                var ruleway = $(".ruleway:checked", $(dialogScope)).val();
                                
                                
                                $(".ui-state-error").removeClass("ui-state-error");
                                $(".validateTips").hide();
                                
                                
                                
                                
                                var noblockmode = false;
                                if ($scope.RuleScope === undefined || $scope.RuleScope == null)
                                    noblockmode = true;
                                
                                if ($scope.RuleScope !== undefined && $scope.RuleScope != null && typeof ($scope.RuleScope.Rules) == "undefined") {
                                    $scope.RuleScope.Rules = [];
                                }
                                
                                
                                
                                
                                
                                
                                
                                
                                var isNew = $scope.EditingRule.Id === undefined;
                                
                                var isNewInBlock = true;
                                
                                if (!$scope.EditingRule.UseExisting) {
                                    
                                    
                                    
                                    if ($scope.RuleScope != null && $scope.RuleScope !== undefined)
                                        $scope.RuleScope.IsDirty = true;
                                    
                                    
                                    $http({ method: 'POST', url: "handlers/Rule.aspx/UpdateRule", data: { "rulejson": JSON.stringify($scope.EditingRule), "projectId": PipeLine.ProjectId, "userid": GlobalUserId } }).
success(function (data, status, headers, config) {
                                    debugger
                                        $scope.EditingRule = JSON.parse(data.d);
                                        RulesDictionaryDataSource[$scope.EditingRule.Id] = $scope.EditingRule;
                                        $scope.Rules = $scope.ToArray(RulesDictionaryDataSource);
                                        //$scope.$apply($scope.Rules);
                                        
                                        if ($scope.RuleScope != null && $scope.RuleScope !== undefined && $scope.RuleScope.Object !== undefined) {
                                            if ($scope.RuleScope.Object.Rules === undefined || $scope.RuleScope.Object.Rules == null)
                                                $scope.RuleScope.Object.Rules = [];
                                            
                                            for (var i = 0; i < $scope.RuleScope.Object.Rules.length; i++)
                                                if ($scope.RuleScope.Object.Rules[i] == $scope.EditingRule.Id)
                                                    isNewInBlock = false;
                                            
                                            
                                            if (isNewInBlock)
                                                $scope.RuleScope.Object.Rules.push($scope.EditingRule.Id);
        //$scope.$apply($scope.RuleScope.Object.Rules);
                                        }
                                        else {
                                            //it means it's the file rules
                                            if ($scope.RuleScope != null && $scope.RuleScope !== undefined && $scope.RuleScope !== undefined) {
                                                if ($scope.RuleScope.Rules === undefined || $scope.RuleScope.Rules == null)
                                                    $scope.RuleScope.Rules = [];
                                                $scope.RuleScope.Rules.push($scope.EditingRule.Id);

            //$scope.$apply($scope.RuleScope.Rules);
                                            }
                                        }
                                    }).
error(function (data, status, headers, config) {
                                    });


                        //$.ajax({
                        //    async: false,
                        //    type: "POST",
                        //    url: "handlers/Rule.aspx/UpdateRule",
                        //    data: { "rule": JSON.stringify($scope.EditingRule), "projectId": PipeLine.ProjectId, "userid": GlobalUserId },
                        //    success: function (msg) {

                        //    }
                        //});
                                }
                                else {
                                    
                                    
                                    if ($scope.RuleScope != null && $scope.RuleScope !== undefined && $scope.RuleScope.ScriptPosition !== undefined) {
                                        if ($scope.RuleScope.Rules == null)
                                            $scope.RuleScope.Rules = [];
                                        $scope.RuleScope.Rules.push($scope.EditingRule.usedRule.Id);
                                        $scope.$apply($scope.RuleScope.Rules);
                                    }
                                    else {
                                        
                                        
                                        if ($scope.RuleScope != null && $scope.RuleScope !== undefined && $scope.RuleScope.Object !== undefined) {
                                            //RulesDictionaryDataSource[rule.Id] = rule;
                                            if ($scope.RuleScope.Object.Rules == null)
                                                $scope.RuleScope.Object.Rules = [];
                                            
                                            
                                            
                                            $scope.RuleScope.Object.Rules.push($scope.EditingRule.usedRule.Id);
                                            
                                            // $scope.RuleScope.Rules = $scope.GetRules($scope.RuleScope.Object.Rules);
                                            $scope.$apply($scope.RuleScope.Object.Rules);
                                            
                                            
                                            
                                            $scope.RuleScope.IsDirty = true;
                                        }
                                    }

                        //MacrosDictionary[macro.Name] = macro;         
                        //$.ajax({
                        //    async: true,
                        //    type: "POST",
                        //    url: "handlers/Rule.aspx?command=UpdateRule",
                        //    data: { "rule": JSON.stringify(rule), "projectId": PipeLine.ProjectId },
                        //    //contentType: "application/json; charset=utf-8",
                        //    //dataType: "json",
                        //    success: function (msg) {

                        //    }
                        //});

                                }
                                
                                
                                setDirty();
                                
                                dialog.close();
                            }

                        }]
                });
                
                
                return;



            }
            
            $scope.createFileRulesDialog = function () {
                
                
                
                $("#RulesDialog").show();
                BootstrapDialog.show({
                    title: getIcon("book") + LNG.ScriptLoadRules,
                    message: $("#RulesDialog"),
                    buttons: [{
                            label: LNG.OK,
                            action: function (dialog) {
                                dialog.close();
                                setDirty();
                            }
                        }]
                });



            }
            $scope.SetMacroRule = function () {
                $scope.EditingRule.RuleType = "Macro";
                if ($scope.EditingRule.RuleExpressions === undefined || $scope.EditingRule.RuleExpressions == null)
                    $scope.EditingRule.RuleExpressions = [];
                if ($scope.EditingRule.RuleExpressions.length == 0) {
                    $scope.EditingRule.RuleExpressions.push({ "Macro": -1 });
                }
            }
            $scope.Filter = {};
            $scope.GetRuleDescription = function (rule) {
                
                
                var str = "";
                
                if (rule !== undefined && rule != null && rule.RuleExpressions !== undefined) {
                    
                    for (var i = 0; i < rule.RuleExpressions.length; i++) {
                        var expr = rule.RuleExpressions[i];
                        var macro = MacrosDictionaryDataSource[expr.Macro];
                        
                        
                        if (macro !== undefined) {
                            if (expr.Value !== undefined && expr.Value != null)
                                str += "  " + macro.Name + " " + $scope.RulesOperatorsDictionary[expr.Operator].Label + " " + expr.Value;
                            else {
                                str += "  " + macro.Name + " " + $scope.RulesOperatorsDictionary[expr.Operator].Label + " ";
                                if (expr.Macros != null) {
                                    for (var x = 0; x < expr.Macros.length; x++) {
                                        if (MacrosDictionaryDataSource[expr.Macros[x]] !== undefined) {
                                            var macrox = MacrosDictionaryDataSource[expr.Macros[x]].Name;
                                            str += "{" + macrox + "} \r\n";
                                        }
                                        else {
                                            str += "{" + LNG.Unknown + "} \r\n";
                                        }
                                    }
                                }
                            }

                    //str += "</br>";
                        }


                    }
                    rule.Description = str;
                }
                
                
                
                return str;

            }
            $scope.SetFilter = function (obj) {
                for (var i in obj) {
                    $scope.Filter[i] = obj[i];
                }
            }
            $scope.MatchFilter = function (obj) {
                for (var i in $scope.Filter) {
                    if (i.indexOf("Object_") == 0) {
                        var skey = i.replace("Object_", "");
                        if ($scope.Filter[i] != null && $scope.Filter[i] != "" && $scope.Filter[i] != obj.Object[skey])
                            return false;
                    }
                    else {
                        if ($scope.Filter[i] != null && $scope.Filter[i] != "" && $scope.Filter[i] != obj[i])
                            return false;
                    }
                }
                return true;
            }
            $scope.Refresh = function () {
                $scope.Blocks = [];
                for (var i = 0; i < PipeLine.Blocks.length; i++) {
                    $scope.Blocks.push(PipeLine.Blocks[i]);
                }
                $scope.$apply($scope.Blocks);
            }
        $scope.ParseObject = function (block) {
            debugger
                var retarr = [];
                if (!block.parsed) {
                    
                    block.Object = JSON.parse(block.Object);
                    block.parsed = true;
                }
                retarr.push(block.Object);
                return retarr;

            }
            $scope.Expandblock = function (block, element) {
                
                if (block.Expanded === undefined)
                    block.Expanded = false;
                var ui = $("li[blockid='" + block.Id + "']");
                var notpressed = !block.Expanded; //$(this).hasClass("btn-info");
                if (notpressed) {
                    block.Expanded = true;
                    
                    if ($(ui).data("state") == "closed" || $(ui).data("state") === undefined) {
                        $(".collapseindicator", ui).click();
                    }
                    
                    //$(this).removeClass("btn-info").addClass("btn-success");
                    
                    $(ui).css("display", "inline-block");
                    $(ui).css("position", "absolute");
                    $(ui).css("top", "50px");
                    $(ui).css("left", "10px");
                    $(ui).css("z-index", "5");
                    
                    $(ui).height($(window).height() - 300);
                    $(ui).width($(window).width() - 30);
                    
                    
                    $(ui).find(".panel-flex").height($(window).height() - 30);
                    $(ui).find(".panel-body-flex").height($(window).height() - 300);
                    $(ui).find(".tabs-flex").height($(window).height() - 400);
                    
                    $(ui).find(".normal").hide();
                    
                    
                    $(ui).find(".fullscreen").show();
                    $(ui).find(".codeeditor").each(function () {
                        var codearea = $(this)[0];
                        $(codearea).css("height", $(window).height() - 260);
                        var editor = ace.edit(codearea);
                        editor.resize();
                    })
                    
                    $(ui).find(".csseditor").each(function () {
                        var codearea = $(this)[0];
                        $(codearea).css("height", $(window).height() - 260);
                        var editor = ace.edit(codearea);
                        editor.resize()
                    });
                }
                else {
                    block.Expanded = false;
                    //$(this).removeClass("btn-success").addClass("btn-info");
                    
                    $(ui).css("display", "inline-block");
                    $(ui).css("position", "static");
                    //$(ui).css("top", "0");
                    //$(ui).css("left", "0");
                    //$(ui).css("z-index", "3");
                    $(ui).css("z-index", "inherit");
                    //$(ui).height($(window).height());
                    $(ui).css("width", "auto");
                    $(ui).css("height", "auto");
                    
                    $(ui).find(".panel-flex").css("height", "auto");
                    $(ui).find(".panel-body-flex").css("height", "auto");
                    $(ui).find(".tabs-flex").css("height", "auto");
                    
                    $(ui).find(".normal").show();
                    
                    $(ui).find(".fullscreen").hide();
                    
                    
                    $(ui).find(".codeeditor").each(function () {
                        var codearea = $(this)[0];
                        $(codearea).css("height", "300px");
                        var editor = ace.edit(codearea);
                        editor.resize()


                    })
                    
                    $(ui).find(".csseditor").each(function () {
                        var codearea = $(this)[0];
                        $(codearea).css("height", "300px");
                        var editor = ace.edit(codearea);
                        editor.resize()
                    });

                }








            }
            
            
            
            
            
            
            $scope.SetBlock = function (block) {
                block.IsDirty = true;
            }
            
            $scope.SaveChanges = function (callback) {
                
                //PipeLine.Name = $("#SiteName").val();
                PipeLine.Name = $("#FileName").val();
                PipeLine.ScriptPosition = $("#ScriptPosition").val();
                
                
                var blockstransaction = [];
                //if (PipeLine.Blocks == null)
                //    PipeLine.Blocks =[];
                
                
                
                $(PipeLine.Blocks).each(function (index) {
                    
                    
                debugger
                    if (!this.IsDirty && !this.IsNew)
                        return;
                    
                    this.IsNew = false;
                    this.IsDirty = false;
                    var blockid = this.Id;
                    var block = JSON.parse(JSON.stringify(this));
                    
                    var blockcontainer = $("li[blockid='" + this.Id + "']");
                    
                    $(".blockproperties", $(blockcontainer)).each(function (index) {
                        if ($(this).attr("ng-model") === undefined)
                            return;
                        
                        var modelKey = $(this).attr("ng-model").replace("block.Object.Properties.", "");
                        
                        // block.Object.Properties[modelKey] = $(this).val();
                        
                        
                        var data = $(this).data("macros");
                        if (data != null) {
                            if (block.Object.Macros === undefined || block.Object.Macros == null)
                                block.Object.Macros = {};
                            
                            block.Object.Macros[modelKey] = data;
                        }
                        else {
                            if (block.Object.Macros != null && block.Object.Macros[modelKey] !== undefined) {
                                delete block.Object.Macros[modelKey];
                            }
                        }
                    });
                    
                    block.Object = JSON.stringify(block.Object);
                    blockstransaction.push(block);
                });
                
                delete PipeLine.CreateDate;
                delete PipeLine.UpdateDate;
                
            debugger
                //copy pipeline
                var stringcopy = JSON.stringify(PipeLine);
                var SavePipline = JSON.parse(stringcopy);
                SavePipline.Rules = null;
                SavePipline.Blocks = null;
                
                var params = JSON.stringify(SavePipline);
                var blocks = JSON.stringify(blockstransaction);
                var rules = encodeURIComponent(JSON.stringify(RulesDictionaryDataSource));
                var macros = encodeURIComponent(JSON.stringify(MacrosDictionaryDataSource));
                var filerules = JSON.stringify(PipeLine.Rules);
                
                
                
                $http({ method: 'POST', url: "handlers/Save.aspx/SaveFile", data: { "data": params, "blocks": blocks, "siteid": SiteId, "versionId": versionId, "filerules": filerules } }).
            success(function (data, status, headers, config) {
                    clearDirty();
                    callback();

                }).
error(function (data, status, headers, config) {
                    
                    alert(data.Message);
                });
                
                
                
                
                if ($scope.WebSite.IsDirty) {
                    var params = { "projectId": $scope.WebSite.Id, "userId": GlobalUserId, "sitename": $scope.WebSite.Name, "sitedomain": $scope.WebSite.Url, "projectmeta": null };
                    
                    
                    
                    $http({ method: 'POST', url: "handlers/Save.aspx/SaveSite", data: params }).
success(function (data, status, headers, config) {
   

                    }).
error(function (data, status, headers, config) {
                        
                        alert(data.Message);
                    });

                }
        //$.ajax({
        //    type: "POST",
        //    url: "handlers/Save.aspx/SaveFile",
        //    data: { "data": params, "blocks": blocks, "siteid": SiteId, "versionId": versionId, "filerules": filerules }, // "macros": escape(macros), "rules": escape(rules)
        //    dataType: "json",
        //    async: true,

        //    complete: function (data, textStatus, jqXHR) {
        //        $scope.$apply($scope.Blocks);
        //        clearDirty();
        //        val = data;
        //        callback();
        //    }
        //});

            }
            
            $scope.DeleteBlock = function (block) {
                
                
                BootstrapDialog.confirm(LNG.ConfirmBlockDelete, function (result, dialog) {
                    if (!result)
                        return;
                    
                    
                    
                    
                    
                    
                    
                    $.ajax({
                        type: "POST",
                        url: "handlers/Block.aspx?command=DeleteBlock",
                        data: { "blockid": block.Id },
                        //contentType: "application/json; charset=utf-8",
                        //dataType: "json",
                        success: function (msg) {
                            
                            // setDirty();
                            for (var i = 0; i < $scope.Blocks.length; i++) {
                                if ($scope.Blocks[i].Id == block.Id) {
                                    $scope.Blocks.splice(i, 1);
                                    break;
                                }
                            }
                            $scope.$apply($scope.Blocks);
                            var scopeide = angular.element($("body")).scope();
                            scopeide.Refresh();
                            dialog.close();
                        }
                    });
                    
                    
                    
                    
                    setDirty(block.Id);


                });



            };
            
            
        $scope.GetProperties = function (block) {
            debugger
                var displayblock = JSON.parse(block.Object);
                var btype = displayblock.Type;
                debugger
                
                if ($("#EntryForms #" + btype).length == 0 ||
                ($("#EntryForms #" + btype).length == 0 && $("#EntryForms div[version='" + block.TypeVersion + "']").length == 0)) {
                    
                    $.ajax({
                        type: "POST",
                        url: "handlers/GetPipeBlock.aspx?type=" + btype,
                        async: false,
                        complete: function (data, textStatus, jqXHR) {
                            
                            $("#EntryForms").append(data.responseText);
                        }
                    });
                }
                var ret = $sce.trustAsHtml($("#EntryForms #" + btype).html());
                $compile(ret);
                return ret;

            }
            
            $scope.RunTestUrl = function (url) {
                window.open("../SiteRun.aspx?scripterid=" + websiteid + "&url=" + escape(url));
                return false;


            }
            
            
            
            //$("#PipeBlocks").sortable({
            //    items: "> li",
            //    handle: ".blocksorthandle",
            //    revert: false,
            //    placeholder: "alert alert-success",
            //    start: function (event, ui) {
            //        //var isOpen = $(ui.item[0]).find(".panel-body").hasClass("hide");
                    
                    
                    
            //        if (!$(ui.item[0]).hasClass("closed")) {
            //            $(ui.item[0]).addClass("closed");
            //            $(ui.item[0]).addClass("tempclosed");
            //        }

            //    },
                
            //    update: function (event, ui) {
                    
            //        if ($(ui.item[0]).hasClass("tempclosed")) {
            //            $(ui.item[0]).removeClass("closed");
            //            $(ui.item[0]).removeClass("tempclosed");
            //        }
                    
            //        $(ui.item[0]).find(".panel-body").removeClass("hide");
                    
            //        var key = $(ui.item[0]).attr("rel");
            //        if (typeof ($(ui.item[0]).attr("blockid")) == "undefined") {
            //    //$.ajax({
            //    //    type: "POST",
            //    //    url: "handlers/NewBlock.ashx?type=" + key,
            //    //    contentType: "application/json; charset=utf-8",
            //    //    dataType: "json",
            //    //    async: true,
            //    //    success: function (data, textStatus, jqXHR) {
            //    //        $(ui.item[0]).attr("blockid", data.Id);
            //    //        $(ui.item[0]).addClass("blockContainer");
            //    //        $(ui.item[0]).addClass("dirty");
            //    //        data.Type = key;
            //    //        //data.Object = {};
            //    //        //data.Object.Id = data.Id;
            //    //        //data.Object.Macros = [];
            //    //        //data.Object.Rules = [];


            //    //        var dataentryform = $("#EntryForms div[rel='" + key + "']").html();
            //    //        PipeLine.Blocks.push(data);


            //    //        var index = $(".blockContainer[blockid='" + data.Id + "']").index();
            //    //        data.Index = index;
            //    //        setBlockUI(data, ui.item);
            //    //        setDirty(data.Id);
            //    //    }
            //    //});
            //        }
            //        else {
                        
            //            //for(var i in PipeLine.Blocks)
            //            //{
            //            //    PipeLine.Blocks[i].Index =  $(".blockContainer[blockid='" + PipeLine.Blocks[i].Id + "']").index();
            //            //}
            //            var tempblocks = PipeLine.Blocks;
            //            //PipeLine.Blocks = {};
                        
            //            $("#PipeBlocks .blockContainer").each(function (index) {
                            
            //                var blockId = $(this).attr("blockid");
                            
            //                for (var i = 0; i < PipeLine.Blocks.length; i++) {
            //                    if (PipeLine.Blocks[i].Id == blockId) {
            //                        $(this).attr("sort", index);
                                    
            //                        PipeLine.Blocks[i].Index = index;
            //                        PipeLine.Blocks[i].Sort = index;
            //                        PipeLine.Blocks[i].IsDirty = true;
            //                        break;
            //                    }
            //                }
            //        //var block = PipeLine.Blocks[blockId];

            //        //PipeLine.Blocks[blockId] = tempblocks[blockId];

            //            })
            //            $scope.$apply($scope.Blocks);
            //            setDirty();





            //        }
            ////use codename to add the controls properies to the block?
            //    }


            //});
            
            $scope.$watch("WebSite", function (newVal, oldVal) {
                $scope.WebSite.IsDirty = true;
            })
            
            if ($scope.PipeLine.Name == "New script") {
                setTimeout(function () {
                    $scope.FileOptions();
                    setTimeout(function () {
                        
                        $('#FileName').popover({ container: 'body' }).popover('show');
                    }, 1000);

                }, 1000);
            }
        }]);
 
$(function () {
    
    $("body").on("click", ".form-label", function () {
        var checkbox = $(this).parents(".panel-heading,.form-group").find("input");
        
        if (checkbox.length > 0)
            checkbox[0].checked = true;
        $(checkbox).trigger("click");


    });
    
    $(".ShowFiles").click(function () {
        
        
        $("#FilesModal").show();
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            title: getIcon("file") + LNG.ProjectFiles,
            message: $("#FilesModal").clone(),
            buttons: [{
                    label: LNG.OK,
                    action: function (dialog) {
                        dialog.close();
                        setDirty();
                    }

                }]
        });
        $("#FilesModal").hide();


    });
    
    
    
    
    $("ul.nav-tabs > li > a", $("#BasicItemInfo")).each(function (index) {
        $(this).attr("tabref", "toolspecinner" + index.toString());
    });
    $(".tab-content > div", $("#BasicItemInfo")).each(function (index) {
        $(this).attr("tabref", "toolspecinner" + index.toString());
    });
    $("ul.nav-tabs > li > a", $("#BasicItemInfo")).click(function () {
        // function settabcallback(element, tabref) {
        var tabref = $(this).attr("tabref");
        
        
        var obj = $("a[tabref='" + tabref + "']", $("#BasicItemInfo"));
        
        
        $(obj).parents("li").siblings().removeClass("active");
        $(obj).parents("li").addClass("active");
        
        $("div[tabref='" + tabref + "']", $("#BasicItemInfo")).siblings().hide()
        $("div[tabref='" + tabref + "']", $("#BasicItemInfo")).show();


        // $("a[href='"+href+"']", $(element)).tab("show");//.tabs("option", "active", 2);
    });
    
    
    $("ul.nav-tabs > li > a", $("#PremiumItemInfo")).each(function (index) {
        $(this).attr("tabref", "toolspecinner" + index.toString());
    });
    $(".tab-content > div", $("#PremiumItemInfo")).each(function (index) {
        $(this).attr("tabref", "toolspecinner" + index.toString());
    });
    $("ul.nav-tabs > li > a", $("#PremiumItemInfo")).click(function () {
        var tabref = $(this).attr("tabref");
        var obj = $("a[tabref='" + tabref + "']", $("#PremiumItemInfo"));
        $(obj).parents("li").siblings().removeClass("active");
        $(obj).parents("li").addClass("active");
        
        $("div[tabref='" + tabref + "']", $("#PremiumItemInfo")).siblings().hide()
        $("div[tabref='" + tabref + "']", $("#PremiumItemInfo")).show();
    });
    
    
    
    $(".ShowBlocks").on("click", function () {
        
        $("#ToolBoxPop").show();
        ToolBoxPopDialog = BootstrapDialog.show({
            type: BootstrapDialog.TYPE_PRIMARY,
            size: BootstrapDialog.SIZE_LARGE,
            height: $(window).height() - 100,
            title: getIcon("th") + LNG.BlockGallery,
            message: $("#ToolBoxPop"),
            onshown: function (dialogRef) {
                $(dialogRef.$modalBody).css("overflow", "hidden");
                
                $("#BlockItemsFreeRpt > section >  ul", $(dialogRef.$modalBody)).height($(dialogRef.$modalBody).height() - 105);
                $("#BlockItemsPremiumRpt  >  section >  ul", $(dialogRef.$modalBody)).height($(dialogRef.$modalBody).height() - 105);
                $("#BlockItemsUsersRpt >  section >  ul", $(dialogRef.$modalBody)).height($(dialogRef.$modalBody).height() - 105);
                
                
                $("#GalleryWelcome", $(dialogRef.$modalBody)).height($(dialogRef.$modalBody).height());
                $("#BasicItemInfo .tab-content > div", $(dialogRef.$modalBody)).height($(dialogRef.$modalBody).height() - 260);
                
                
                var parentblock = dialogRef.$modalBody;
                $("ul.nav-tabs > li > a.fixtab", $(parentblock)).each(function (index) {
                    $(this).attr("tabref", "toolspec" + index.toString());
                });
                
                $(".tab-content > div.fixtab", $(parentblock)).each(function (index) {
                    $(this).attr("tabref", "toolspec" + index.toString());
                });
                
                $("ul.nav-tabs > li > a.fixtab", $(parentblock)).click(function () {
                    // function settabcallback(element, tabref) {
                    var tabref = $(this).attr("tabref");
                    
                    
                    var obj = $("a[tabref='" + tabref + "']", $(parentblock));
                    
                    
                    $(obj).parents("li").siblings().removeClass("active");
                    $(obj).parents("li").addClass("active");
                    
                    $("div[tabref='" + tabref + "']", $(parentblock)).siblings().hide()
                    $("div[tabref='" + tabref + "']", $(parentblock)).show();


                     // $("a[href='"+href+"']", $(element)).tab("show");//.tabs("option", "active", 2);
                });
                
                // $("#BlockItemsRpt > ul", $(dialogRef.$modalBody)).parent().height($(dialogRef.$modalBody).height() -40 );
                  
            },
            buttons: [{
                    label: LNG.OK,
                    action: function (dialog) {
                        dialog.close();
                        setDirty();
                    }

                }]
        });
        $("#ToolBoxPop").hide();
        
       

    });


});






