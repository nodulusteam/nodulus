




module.exports.renderMaster = function (page) {
    var controlTree = page.controls, pageStr = page.fileContent, masterPageStr = page.masterpage.fileContent;
    var result = "";
    var lastIndex = 0;
    result = "";
    lastIndex = 0;

    var cheerio = require('cheerio');
    var $ = cheerio.load(masterPageStr, {
        normalizeWhitespace: true,
        xmlMode: true
    });

 
    var $page = cheerio.load(pageStr, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    for (var placeholderId in page.contents) {

        if (page.contents[placeholderId] !== undefined) {
            var content = page.contents[placeholderId];
            placeholderStr = $page('run__content[id="' + placeholderId + '"]').html();//  pageStr.substring(content.startIndex, content.endIndex);
           // placeholderStr = placeholderStr.substring(placeholderStr.indexOf('>') + 1);
           // placeholderStr = placeholderStr.substring(0, placeholderStr.lastIndexOf('<'));

            $('placeholder[id="' + placeholderId + '"]').replaceWith(placeholderStr); //::placeholder[id="'+ placeholderId+ '"]'
        }
    }

    return $.html();

}


module.exports.render = function (page) {


    var controlTree = page.controls, pageStr = page.fileContent;


    var cheerio = require('cheerio');
    var $ = cheerio.load(pageStr, {
        normalizeWhitespace: true,
        xmlMode: true
    });



    for (var i = 0; i < controlTree.length; i++) {
        var control = controlTree[i];
        
        $(control.originalname + '[id="' + control.id + '"]').replaceWith(control.renderResult);

        //         result += pageStr.substring(lastIndex, control.startIndex);
        //         result += control.renderResult;
        //         var endIndex = control.endIndex;
        //         if (i < controlTree.length - 1)
        //             endIndex = controlTree[i + 1].startIndex;
        // 
        //         result += pageStr.substring(control.endIndex + 1, endIndex);
        //         lastIndex = endIndex;
    }
    //result += pageStr.substring(lastIndex + 1);

    return page.fileContent = $.html();



}

