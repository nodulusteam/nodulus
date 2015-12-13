var setup = (function () {
    
 
    
    
    

    function _install(module_name) {
        
      
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