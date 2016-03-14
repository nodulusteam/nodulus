var ejs = require('ejs');
var async = require('async');
var fs = require('fs');

module.exports.run = function (context, callback, errorcallback) {
    var page = context.page;
    if (context.page === undefined) {
        page = new global.nodulus.classes.Page(context);
        context.page = page;
    }

    //attach a new parser instance to the page
    page.parser = new global.nodulus.parser.Parser(context);

    page.run(function () {
        page.fileContent = ejs.render(page.fileContent, page);
        page.fileContent = decodeURI(page.fileContent);
        try {


            page.parser.buildTree(page);
            // page.parser.parsePlaceHolders(page, function () {
            global.nodulus.runner.runChildren(context, page.controls, function () {
                var result = global.nodulus.renderer.render(page);

                page.fileContent = result;
                if (page.masterpage) {
                    page.masterpage.run(function () {
                        try {
                            page.parser.buildTree(page.masterpage);
                            global.nodulus.runner.runChildren(context, page.masterpage.controls, function () {
                                global.nodulus.renderer.render(page.masterpage);
                                page.masterpage.fileContent = ejs.render(page.masterpage.fileContent, page.masterpage);
                                page.parser = new global.nodulus.parser.Parser(context);
                                page.parser.parsePlaceHolders(page.masterpage, function () {

                                    callback(page.fileContent);
                                });
                            });
                        }
                        catch (e) {

                            errorcallback(e.message);

                        }


                    })
                }


                //     page.parser.parsePlaceHolders(page, function () {
                //     if(page.masterpage)
                //     {
                //     
                //       //  page.masterpage.merge(page);
                //         
                //         callback(page.fileContent);
                //     }
                //     else
                //     {
                //     callback(page.fileContent);    
                //     }
                //     
                //     //
                //  });

            });
        }
        catch (e) {

            errorcallback(e.message);

        }

    });


}

function runScript(control, callback) {

    if (control.type.script !== undefined && control.type.script.init !== undefined) {
        
        var controlContext = {attributes: control.attributes, data: control.data, control: control};
        control.type.script.init(control.context, controlContext, function (controlContext) {
            control.renderResult = ejs.render(control.type.template, controlContext);
            callback();
        });
    }
    else {
        callback();
    }
    //control.renderResult = ejs.render(control.type.template, control.type.script.model);

}




module.exports.runChildren = function (context, controlTree, callback) {

    //add the context to the control
    for (var i = 0; i < controlTree; i++) {
        controlTree[i].context = context;
    }

    async.each(controlTree, runScript, function (err) {

        callback();
        // if any of the saves produced an error, err would equal that error
    });




    // result += pageStr.substring(lastIndex, controlTree[i].startIndex);
    // result += "CONTROL CONTENT";
    // var endIndex =  controlTree[i].endIndex;
    // if(i < controlTree.length-1)
    //     endIndex =   controlTree[i+1].startIndex;
    //
    //
    // result += pageStr.substring(controlTree[i].endIndex+1, endIndex);
    // lastIndex = endIndex;



}
