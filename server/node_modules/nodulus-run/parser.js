const htmlParserclass = require("htmlparser2");
var fs = require('fs');
var path = require('path');



module.exports.Parser = function (context) {
    var instance = this;
    this.buildTree = function (pageInstance) {
        pageInstance.controls = [];
        this.pageInstance = pageInstance;

        this.parser.write(pageInstance.fileContent);
        this.parser.end();


    }

    var lastContentId = "";
    var lastPlaceHolder;
    var attrBag = {};
    this.parser = new htmlParserclass.Parser({
        onopentag: function (name, attribs) {


            if (name.indexOf("run__") == 0) {
                var parts = name.split('__');

                switch (parts[1]) {
                    case "master":
                        var c = new global.nodulus.classes.MasterPage(context, attrBag);
                        instance.pageInstance.masterpage = c;
                        instance.pageInstance.masterpage.startIndex = instance.parser.startIndex;
                        break;
                    case "content":
                        lastContentId = attribs["id"]
                        instance.pageInstance.contents[lastContentId] = { startIndex: instance.parser.startIndex }



                        //instance.pageInstance.masterpage.placeholders[];
                        //for(var i=0;i<)
                        break;
                        //     
                        //     case "placeholder":
                        //     //var placeholder = new global.nodulus.classes.PlaceHolder(attrBag);
                        //  
                        //     placeholder.startIndex = instance.parser.startIndex;
                        //     instance.pageInstance.masterpage.placeholders.push(placeholder );  
                        //     
                        //     break;
                }

                //.controls[instance.pageInstance.controls.length-1]
            }
            else if (name.indexOf("run_") == 0) {
                var parts = name.split('_');
                var effectiveName = parts[parts.length-1];
                var effectiveNamespace = name.replace("run_", "").replace("_" + effectiveName, "");
                if(parts.length == 2)
                {
                    effectiveNamespace = parts[0];
                }
                var c = new global.nodulus.classes.Control(effectiveNamespace, effectiveName);
                c.originalname = name;
                c.attributes = attrBag;
                
                if (attrBag["id"] === undefined)
                    throw (new Error('element ' + name + ' is missing an id'));

                c.id = attrBag["id"];
                c.startIndex = instance.parser.startIndex;
                instance.pageInstance.controls.push(c);
                //instance.pageInstance.controls[instance.pageInstance.controls.length-1]

            }
            attrBag = {};
        },
        onattribute: function (name, value) {
            attrBag[name] = value;
        },
        onclosetag: function (tagname) {
            if (tagname.indexOf("run__") == 0) {
                var parts = tagname.split('__');
                switch (parts[1]) {
                    case "master":
                        //    instance.pageInstance.masterpage.endIndex = instance.parser.endIndex;

                        break;
                    case "content":

                        instance.pageInstance.contents[lastContentId].endIndex = instance.parser.endIndex + (tagname.length);

                        break;

                    case "placeholder":


                        break;
                }
            } else
                if (tagname.indexOf("run") == 0) {
                    instance.pageInstance.controls[instance.pageInstance.controls.length - 1].endIndex = instance.parser.endIndex;
                }
        }
    }, { decodeEntities: true });



    this.parsePlaceHolders = function (pageInstance, callback) {
        // pageInstance.controls = [];
        this.pageInstance = pageInstance;


        this.directiveParser.write(pageInstance.fileContent);
        this.directiveParser.end();




        callback();

        //callback();
    }


    this.directiveParser = new htmlParserclass.Parser({
        onopentag: function (name, attribs) {
            if (name.indexOf("run__") == 0) {
                var parts = name.split('__');

                switch (parts[1]) {
                    case "master":
                        var c = new global.nodulus.classes.MasterPage(attrBag);
                        instance.masterpage = c;

                    case "content":
                        lastContentId = attribs["id"]
                        instance.pageInstance.contents[lastContentId] = { startIndex: instance.parser.startIndex }

                        //instance.pageInstance.masterpage.placeholders[];
                        //for(var i=0;i<)
                        break;

                    case "placeholder":
                        var placeholder = new global.nodulus.classes.PlaceHolder(attrBag);

                        placeholder.startMargin = instance.parser.startIndex
                        placeholder.startIndex = instance.parser.endIndex;
                        lastPlaceHolder = attribs["id"];
                        instance.pageInstance.placeholders[lastPlaceHolder] = placeholder;
                        break;


                        // // // case "placeholder":
                        // // // var placeholder = new global.nodulus.classes.PlaceHolder(attrBag);
                        // // // lastPlaceHolder = attribs["id"];
                        // // // placeholder.startIndex = instance.parser.startIndex;
                        // // // instance.pageInstance.masterpage.placeholders[lastPlaceHolder] = placeholder;  

                        break;
                }

                //.controls[instance.pageInstance.controls.length-1]
            }


            attrBag = {};
        },
        onattribute: function (name, value) {
            attrBag[name] = value;
        },
        onclosetag: function (tagname) {
            if (tagname.indexOf("run__") == 0) {
                var parts = tagname.split('__');

                switch (parts[1]) {
                    case "master":
                        //  var c = new global.nodulus.classes.MasterPage(attrBag);               
                        //  instance.masterpage = c;    

                        break;
                    case "content":

                        break;

                    case "placeholder":
                        instance.pageInstance.placeholders[lastPlaceHolder].endIndex = instance.parser.endIndex;
                        break;
                }

                //.controls[instance.pageInstance.controls.length-1]
            }
            else if (tagname.indexOf("run") == 0) {

            }
        }
    }, { decodeEntities: true });


}


