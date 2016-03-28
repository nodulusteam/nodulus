/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
  




angular.module('nodulus').controller("pipelineController", function ($scope, $Alerts, $IDE, $translate, $resource, $Language) { 


    debugger

    $scope.showBlocks = function () { 
        
            
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
        
       

       
    }
});





















var currentblockid;
var isDirty = false;
var versionId = 0;
var activeBlocks = {};


function setDirty(id) {
    
    isDirty = true;
    setStatus();
    if (id !== undefined) {
        $(".blockContainer[blockid='" + id + "']").addClass("dirty");
    } else {
        $(".blockContainer").addClass("dirty");
    }
    $(".SaveBtn").removeClass("btn-info").addClass("btn-danger");


}
function clearDirty() {
    
    isDirty = false;
    setStatus();
    $(".SaveBtn").addClass("btn-success").removeClass("btn-danger");
    setTimeout(function () {
        $(".SaveBtn").addClass("btn-info").removeClass("btn-success");
    }, 2000);
}
function setStatus() {
    
    if (isDirty) {
        $("#StatusLine").html('<button class="btn btn-warning"><span class="documentstatus">*(Changed)</span></button>');
    }
    else {
        $("#StatusLine").html('<button class="btn btn-success"><span class="documentstatus">(Ready)</span></button>');
    }
    
    //   $(".documentstatus").html((isDirty) ? "*(not saved)" : "(ready)");
    
    var macrocount = 0;
    for (var i in MacrosDictionaryDataSource)
        macrocount++;
    
    var rulecount = 0;
    for (var i in RulesDictionaryDataSource)
        rulecount++;
    $(".macrosstatus").html("(" + macrocount + ")");
    $(".rulesstatus").html("(" + rulecount + ")");


    //Script status: macros <span class="macrosstatus">(1)(0)</span>   rules <span class="rulesstatus">(1)(4)</span>  <span class="documentstatus">(not saved)</span></a>

}
window.onbeforeunload = function () {
    if (isDirty)
        return "some items were not saved, close window any way?";

};


function buildRuleDescription(rule) {
    
    var str = "";
    
    if (rule !== undefined && rule != null && rule.RuleExpressions !== undefined) {
        
        for (var i = 0; i < rule.RuleExpressions.length; i++) {
            var expr = rule.RuleExpressions[i];
            var macro = MacrosDictionaryDataSource[expr.Macro];
            
            if (macro !== undefined) {
                if (expr.Value !== undefined && expr.Value != null)
                    str += "  " + macro.Name + " " + expr.Operator + " " + expr.Value;
                else {
                    str += "  " + macro.Name + " " + expr.Operator + " ";
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
                
                str += "</br>";
            }


        }
        rule.Description = str;
    }
    
    
    
    return str;

}



var ide_gap = 200;

function bindBlockOperatorsDictionary() {
    $("#ExistingBlockOperators").html("");
    $("#ExistingBlockOperators").append("<option value=''>Select</option>");
    for (var i in BlockOperators) {
        $("#ExistingBlockOperators").append("<option value='" + BlockOperators[i].Id + "'>" + BlockOperators[i].FirstName + " " + BlockOperators[i].FirstName + "</option>");

    }



}

/* broswe section*/
var BrowserDialog;

function InitializeCodeBlocks(element) {
    ace.require("ace/ext/language_tools");
    
    $(element).find(".codeeditor").each(function () {
        
        
        var codearea = $(this)[0];
        var editor = ace.edit(codearea);
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true
        });
        
        //   editor.setValue($(this).next().val());
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/javascript");




    })
    
    $(element).find(".csseditor").each(function () {
        //var myCodeMirror = CodeMirror.fromTextArea($(this)[0], { mode: "javascript" });
        
        
        var codearea = $(this)[0];
        var editor = ace.edit(codearea);
        
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true
        });
        //editor.setValue($(this).next().val());
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/css");





    })
    $(element).find(".editor").each(function () {
        CKEDITOR.env.isCompatible = true;
        $(this).ckeditor();
    });


}



function CreateBrowserDialog(targetElement) {
    
    debugger
    var testurl = $(targetElement).parents(".blockContainer").find("input[ng-model='block.TestUrl']").val();
    if (testurl !== "" && testurl !== undefined)
        $("#BrowserUrl").val(testurl);
    else
        $("#BrowserUrl").val(WebSite.Url);
    
    
    if (BrowserDialog == null) {
        
        $("#BrowserDialog").show();
        
        BrowserDialog = BootstrapDialog.show({
            
            type: BootstrapDialog.TYPE_PRIMARY,
            size: BootstrapDialog.SIZE_FULL,
            // height: $(window).height(),
            title: getIcon("marker") + LNG.SelectElement,
            message: $("#BrowserDialog"),
            onshow: function (dialogRef) {
                var source = $(".SelectorForm");
                $(dialogRef.$modalBody).find("iframe").height($(window).height() - 100);
                $(dialogRef.$modalBody).css("overflow", "hidden");
                dialogRef.getModalFooter().append(source);
                
                $(".bootstrap-dialog-footer-buttons .btn", $(dialogRef.$modal)).remove();
                //source.clone().appendTo($(".bootstrap-dialog-footer-buttons", $(dialogRef.$modal))).find(".SelectElement").data("targetElement", targetElement);
                //source.remove();
            },
            buttons: [{}]
            //    {
            //    label: 'OK',
            //    action: function (dialog) {
            //        var scope = dialog.$modalBody;
            //        $(targetElement).val($("#ElementSelector").val());
            //        setDirty();



            //        dialog.close();

            //    }

            //}]
        });
        
        
        // $("#BrowserUrl", $(siteDialog.$modalBody)).val(testurl);
        //  $("#BrowserDialog iframe", $(siteDialog.$modalBody)).attr("src", "Browser.aspx?url=" + escape(testurl));
        
        $("#BrowserDialog").hide();
    }
    
    BrowserDialog.open();
    
    
    
    BrowserDialog.getModalFooter().find(".SelectElement").data("targetElement", targetElement);
    BrowserDialog.getModalFooter().find("#ElementSelectorTemp").attr("id", "ElementSelector");


}
/*end browser section*/

function getIcon(icon) {
    return '<span class="glyphicon glyphicon-' + icon + '"></span> ';
}

var stackedDialogs = 0;
function setScrollOnDialog(hide) {
    if (hide) {
        stackedDialogs++;
        $("html").addClass("stop-scrolling");
    }
    else {
        stackedDialogs--;
        if (stackedDialogs < 1) {
            stackedDialogs = 0;
            $("html").removeClass("stop-scrolling");
        }
    }

}

$(function () {
    
    return;

    $("body").on("click", "a.selectElementBtn", function () {
        
        CreateBrowserDialog($(this).parents(".form-group").find("input,textarea"));
    });
    $("body").on("keyup", ".fileFilter", function () {
        var cont = $(this).parents(".modal-body");
        var tb = $(this);
        
        $("#OtherFiles", $(cont)).next().hide();
        if (tb.val() == "")
            $("#OtherFiles a", $(cont)).show();
        else
            $("#OtherFiles > a ", $(cont)).each(function (index) {
                if ($(this).text().toLowerCase().indexOf(tb.val().toLowerCase()) < 0) {
                    $(this).hide();
                }
            });
        
        if ($("#OtherFiles > a:visible ", $(cont)).length == 0) {
            $("#OtherFiles", $(cont)).next().show();
        }

    });
    
    
    $(".ShowMacros").click(function () {
        
        $("#MacrosModal").show();
        BrowserDialog = BootstrapDialog.show({
            
            type: BootstrapDialog.TYPE_PRIMARY,
            size: BootstrapDialog.SIZE_MEDIUM,
            //height: $(window).height(),
            title: getIcon("flag") + LNG.Macros,
            message: $("#MacrosModal")
        });
        //  $("#MacrosModal").hide();


    });
    
    
    $(".ShowRules").click(function () {
        
        $("#RulesModal").show();
        BrowserDialog = BootstrapDialog.show({
            
            type: BootstrapDialog.TYPE_PRIMARY,
            size: BootstrapDialog.SIZE_MEDIUM,
            //height: $(window).height(),
            title: getIcon("book") + LNG.Rules,
            message: $("#RulesModal")
        });
        $("#RulesModal").hide();


    });
    $("#IDEGAP").height($(".navbar-fixed-top").height() - 70);
    $(window).resize(function () {
        
        $("#IDEGAP").height($(".navbar-fixed-top").height() - 70);
    })
    // $("#PipeBlocksBox").height($(window).height() - ide_gap);
    
    debugger

    if (typeof (PipeLine.Rules) == "string") {
        PipeLine.Rules = JSON.parse(PipeLine.Rules);
    }
    
    //$(".accordion").accordion({
    //    header: "section",
    //    heightStyle: "fill",
    //    autoHeight: false,
    //    collapsible: true
    //});
    //$(".accordion").accordion("refresh");
    
    $("#accordion-resizer").resizable({
        minHeight: 140,
        minWidth: 200,
        resize: function () {
            $(".accordion").accordion("refresh");
        }
    });
    
    
    //$("#MacroForm a.selectElementBtn").on('click', function () {
    //    CreateBrowserDialog($(this).prev("input,textarea"));
    //});
    
    
    $("body").on("click", ".list-group-item", function () {
        var cont = $(this).parents(".list-group");
        $(".list-group-item", $(cont)).removeClass("active");
        $(this).addClass("active");

    });
    
    
    
    
    
    
    
    $("ul, li").disableSelection();
    
    
    var rulesmarkup = "<tr  ruleid='${Id}'><td class='activecell'>${Name}</td><td class='activecell'>${RuleType}</td><td class='activecell'>{{html Description}}  </td><td class='activecell'>${Event} {${Selector}}</td><td><a class='delrule btn btn-danger btn-sm'><i class='glyphicon glyphicon-remove' title='delete'></i></a></td></tr>";
    
    
    var macromarkup = "<tr><td>${Name}</td><td>${MacroType}</td><td>${Value}</td><td><a class='delmacro btn btn-danger btn-sm' rel='${Id}'><span class='glyphicon glyphicon-remove' title='remove'></span></a></td></tr>";
    
    var rulestoolboxmarkup = '<a rel="${Id}" class="list-group-item"><label rel="${Id}">${Name}</label> ' +
         '<div class="btn-group pull-right">' +
                                '<button type="button" class="btn btn-info btn-md editrulesdic"><span class="glyphicon glyphicon-pencil"></span></button>' +
                               ' <button type="button" class="btn btn-danger btn-md delrulesdic"><span class="glyphicon glyphicon-trash"></span></button>' +
        '</div> <small class="pill">${RuleType}</small><div class="clearboth"></div></a>';
    
    
    
    var macrostoolboxmarkup = '<a rel="${Id}" class="list-group-item"><label rel="${Id}" title="${MacroType}">${Name}</label>' +

        '<div class="btn-group pull-right">' +
                                '<button type="button" class="btn btn-info btn-md editmacrodic"><span class="glyphicon glyphicon-pencil"></span></button>' +
                               ' <button type="button" class="btn btn-danger btn-md delmacrodic"><span class="glyphicon glyphicon-trash"></span></button>' +

                            '</div> <small><i>${MacroType} ${Value} </i></small><div class="clearboth"></div></a>';
    
    
    var macroselectmarkup = "<option value='${Id}'>${Name} - ${MacroType}</option>";
    
    
    
    
    
    ///* Compile the markup as a named template */
    //$.template("rulesTemplate", rulesmarkup);
    //$.template("macrosTemplate", macromarkup);
    
    
    //$.template("rulesToolboxTemplate", rulestoolboxmarkup);
    //$.template("macrosToolboxTemplate", macrostoolboxmarkup);
    //$.template("macroselectTemplate", macroselectmarkup);
    
    /* Render the template with the movies data and insert
    the rendered HTML under the "movieList" element */


    bindBlockOperatorsDictionary();
    
    //bindRulesDictionary();
    
    $("#PipeBlocks .blockContainer").each(function (index) {
        return;
        
    debugger
        var key = $(this).attr("codename");
        var blockId = $(this).attr("blockid");
        var block;
        for (var i = 0; i < PipeLine.Blocks.length; i++)
            if (PipeLine.Blocks[i].Id == blockId) {
                block = PipeLine.Blocks[i];
                block = eval("new Object(" + block.Object + ")");
                block.BlockOperators = PipeLine.Blocks[i].BlockOperators;
                break;
            }
        //   var block = PipeLine.Blocks[blockId];
        
        
        setBlockUI(block, $(this));
        
        
        
        //$(".blockdata[rel='name']", this).val(block.Name);
        //$(".blockdata[rel='description']", this).val(block.Description);
        //$(".blockdata[rel='testurl']", this).val(block.TestUrl);      
        //$(".blockdata[rel='testurl']", this).attr("scripterid", PipeLine.Id);
        
        //$(".blockdata[rel='status']", this).val(block.Status);
        
        
        
        
        
        
        if (block.UseRules) {
            //bind the rule       
            
            
            var ruleslist = [];
            for (var c in block.Rules) {
                if (RulesDictionaryDataSource[block.Rules[c]] !== undefined) {
                    //  buildRuleDescription(RulesDictionaryDataSource[block.Rules[c]]);
                    ruleslist.push(RulesDictionaryDataSource[block.Rules[c]]);
                }

            }
            
            if (ruleslist.length == 0)
                $(this).find(".norules-error").show();
            else
                $(this).find(".norules-error").hide();
            
            $.tmpl("rulesTemplate", ruleslist).appendTo($(this).find(".RulesPH"));

        }
    });
    
    
    
    
    $("#MacroType").on("change", function () {
        $(".macrorow").hide();
        $(".macrorow#" + $(this).val()).show();

    });
    
    
    
    
    
    $(window).bind('keydown', function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 's':
                    event.preventDefault();
                    $("#SaveBtn").trigger("click");
                    break;
                    //case 'f':
                    //    event.preventDefault();
                    //    alert('ctrl-f');
                    //    break;
                    //case 'g':
                    //    event.preventDefault();
                    //    alert('ctrl-g');
                    //    break;
            }
        }
    });
    
    $(".SaveBtn").click(function () {
        $(this).find(".indicator").removeClass("hidden");
        $(this).find(".preindicator").addClass("hidden");
        var btn = $(this);
        angular.element($("#PipeBlocksBox")).scope().SaveChanges(function () {
            $(btn).find(".indicator").addClass("hidden");
            $(btn).find(".preindicator").removeClass("hidden");
        });
    });
    
    $("#LoadRulesBtn").click(function () {
        angular.element($("#PipeBlocksBox")).scope().createFileRulesDialog();
    });
    
    $("#PublishBtn").click(function () {
        // PipeLine.Name = $("#SiteName").val();
        PipeLine.Name = $("#FileName").val();
        
        var params = JSON.stringify(PipeLine);
        
        $.ajax({
            type: "POST",
            url: "handlers/Save.ashx",
            data: { "data": params, "mode": "publish" },
            dataType: "json",
            async: true,
            success: function (data, textStatus, jqXHR) {
                val = data;
            }
        });
    });
    
    
    
    $("#PreviewVersionBtn").click(function () {
        window.open("../Scripter.aspx?siteid=" + SiteId + "&id=" + PipeLine.Id);
    });
    
    
    
    
    
    
    
    $("fieldset input").on('focus', function () {
        $(this).prev().addClass("hilight");
    });
    $("fieldset input").on('blur', function () {
        $(this).prev().removeClass("hilight");
    });
    
    
    
    
    
    
    $("body").on("click", ".addFile", function () {
        document.location.href = "Pipeline.aspx?siteid=" + SiteId + "&id=" + $(this).attr("rel");
    });
    $("body").on("click", ".editfile", function () {
        document.location.href = "Pipeline.aspx?siteid=" + SiteId + "&id=" + $(this).parents("a").attr("rel");
    });
    
    $("body").on("click", ".delfile", function () {
        var btn = this;
        BootstrapDialog.confirm("Are you sure you want to delete this file?", function (result) {
            if (!result)
                return;
            
            $.get("handlers/DeleteFile.ashx?siteid=" + SiteId + "&id=" + $(btn).parents("a").attr("rel"), function () {
                $(btn).parents("a").remove();
                if ($(btn).parents("a").attr("rel") == fileId)
                    document.location.href = "Websites.aspx";
            });

        });
    });
    
    
    
    
    $(".draggable").draggable({
        connectToSortable: "#PipeBlocks",
        helper: "clone",
        revert: "invalid"
    });
    
    $(".blockdata").on('change', function () {
        var container = $(this).parents(".blockContainer");
        var blockId = container.attr("blockid");
        setDirty(blockId);
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    $("body").on('click', ".clearmacroBtn", function () {
        
        var input = $(this).parents(".form-group").find("input,select,textarea");
        
        input.data("macros", null);
        
        var container = $(this).parents(".blockContainer");
        var blockId = container.attr("blockid");
        setDirty(blockId);
        
        if ($(input)[0].tagName == "SELECT") {
            $(input).find(".macrobind").remove();
        }
        //bindMacroInput(input);
        $(this).hide();

    });
    
    
    $(".delversion").on('click', function () {
        
        
        if (confirm("are you sure, this will delete the version")) {
            var delb = $(this);
            
            $.ajax({
                type: "POST",
                url: "handlers/Save.ashx",
                data: { "mode": "deleteversion", "siteid": SiteId, "versionid": delb.attr("rel") },
                dataType: "json",
                async: true,
                complete: function (data, textStatus, jqXHR) {
                    
                    
                    clearDirty();
                    val = data;
                }
            });

        }

    });
    
    $(".runpage").click(function () {
        window.open("../SiteRun.aspx?scripterid=" + $(this).attr("rel") + "&url=" + escape($(this).attr("addr")));
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    $("body").on('change', ".blockdata, .blockproperties", function () {
        angular.element($(this).parents(".blockContainer")).scope().block.IsDirty = true;;
        setDirty($(this).parents(".blockContainer").attr("blockid"));
    });
    
    //$("body").on('change', "select, input",function () {
    //    setDirty();
    //});
    
    setStatus();
    
    // State.apply();
    $("body").on("click", ".GoBrowse", function () {
        var contdialog = $(this).parents(".modal-body");
        
        
        $("#BrowserDialog iframe", $(contdialog)).attr("src", "Browser.aspx?url=" + escape($("#BrowserUrl", $(contdialog)).val()));
    });
    
    
    $("body").on("click", ".SelectElement", function () {
        var contdialog = $(this).parents(".modal-dialog");
        
        $(this).data("targetElement").val($("#ElementSelector", $(contdialog)).val()).change();
        // setDirty();
        BrowserDialog.close();
    });




});





 


