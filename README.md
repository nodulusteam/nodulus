


# nodulus 
##by ewave@open-source


a modular back-office for node.js using angular.js and mongoDB.

so you want to build your next application / website / mobile app / REST api using the almighty powers of the MEAN stack, but you don't have the managemnt application to manage the data and operations, well,  nodulus to the rescue.

nodulus allows you to build and design your own back office modules or use the predefined ones, while focusing on the exact actions you need to add to your managemnt consoles.
it uses a manifest file to define the module files, scripts, dependencies, routes etc.

### the manifest.json file
```
{
"module": {
    "name": "my_module_name" // the name for the module
  },
  "files": [
    "somescript.js",
    "apage.html"    
  ],
  "scripts": [
    "3partyscript.js"
    
  ],
  "dependencies": [ 
    "bootstrap-decorator.min.js",
    "schem-form-definitions.js",
    "angular-schema-form-dynamic-select.js",
    "bootstrap-ui-ace.min.js"   
  ],
  "routes": [
    {
      "route": "/schemas",
      "path": "schemas.js"
    }
  ],
  
  "npm": {

  },
  "navigation": [

  ]



}
```


﻿![Alt text](platform-images/login-screen.jpg?raw=true "Login")



