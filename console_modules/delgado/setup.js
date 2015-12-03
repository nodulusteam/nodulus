var setup = (function () {
    
    var fs = require("fs-extra");
    var JSZip = require("jszip");     
    var dal = require("../../classes/dal.js");
    
    
    

    function _install(module_name) {
        
        fs.ensureDirSync(global.appRoot + "\\public\\modules\\");
        fs.ensureDirSync(global.appRoot + "\\public\\modules\\" + module_name);

    // read a zip file
        fs.readFile(__dirname  + "\\" + module_name + ".zip", function (err, data) {
        if (err) throw err;
            var zip = new JSZip(data);
            for (var filename in zip.files) {
                var fileData = zip.file(filename).asText();
                fs.writeFileSync(global.appRoot +"\\public\\modules\\" + module_name +"\\" +  filename, fileData, 'utf8');
            }

    });
        //unzip the file
    

        //set up the menu entries
        dal.connect(function (err, db) { 
            
            db.collection("Navigation").save({
                "_id" : module_name,                 
                "ParentId" : "00000000-0000-0000-0000-000000000000",
                "Name" : module_name,
                "label" : module_name,
                "Url" : "/modules/delgado/Websites.html",
                "Alias" : "Websites"
            })
             
        
        })

    }
    function _uninstall(module_name) {
    
    
    }
    

    return {
        install: _install,
        uninstall: _uninstall
    };
})();
// node.js module export
module.exports = setup;