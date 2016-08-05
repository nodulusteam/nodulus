/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.allowedContent = true;
    config.extraPlugins = 'youtube,placeholder,backgrounds,stylesheetparser,onchange,base64image';
    //config.filebrowserUploadUrl = AppRoot + "/pub_image_upload.aspx";
    //config.filebrowserBrowserUrl = AppRoot + "/pub_MEDIA_frameset.aspx";
    config.protectedSource.push(/<\?[\s\S]*?\?>/g);   // PHP code
    config.protectedSource.push(/<%[\s\S]*?%>/g);   // ASP code
    config.protectedSource.push(/(]+>[\s|\S]*?<\/asp:[^\>]+>)|(]+\/>)/gi);   // ASP.Net code
    
    config.pasteFromWordRemoveFontStyles = false;
    config.pasteFromWordRemoveStyles = false;
  
    config.toolbarCanCollapse = true;
    config.removePlugins = 'elementspath';
   // config.contentsCss = AppRoot + '/Config/Style/Editor.css';
    config.stylesSet = [];
    config.entities = false;
    config.toolbar = 'Basic';
    config.toolbar_Basic =
    [


       ["Source", "Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo"], ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "RemoveFormat"],
       ["Find", "Replace", "SelectAll", "Scayt", "Image","base64image", "Table", "HorizontalRule", "SpecialChar", "Iframe"],
 ["UIColor", "Maximize", "ShowBlocks"], ["Link", "Unlink", "Anchor"],  ["About"], '/',
["NumberedList", "BulletedList", "Outdent", "Indent", "Blockquote", "CreateDiv", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock", "BidiLtr", "BidiRtl"],  

["Format", "Font", "FontSize", "TextColor", "BGColor" ,"Youtube"]


    ];

    config.toolbar_Simple =
    [


       ["Source", "Preview", "Print", "Templates", "document"],
       ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo"],
       ["Find", "Replace", "SelectAll", "Scayt"],
["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "RemoveFormat", "UIColor", "Maximize", "ShowBlocks"], ["About"], '/',
["NumberedList", "BulletedList", "Outdent", "Indent", "Blockquote", "CreateDiv", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock", "BidiLtr", "BidiRtl"],
["Link", "Unlink", "Anchor"],
["CreatePlaceholder", "Image", "Table", "HorizontalRule",  "SpecialChar",  "Iframe", "InsertPre"],
["Styles", "Format", "Font", "FontSize", "TextColor", "BGColor", "base64image"], ["Youtube"]



    ];

    // Only add rules for <p> and <span> elements.
    //config.stylesheetParser_validSelectors = /\^(p|span)\.\w+/;
    // Ignore rules for <body> and <caption> elements, classes starting with "high", and any class defined for no specific element.
    // config.stylesheetParser_skipSelectors = /(^body\.|^caption\.|\.high|^\.)/i;
};
