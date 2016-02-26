# nodulus 
##by ewave@open-source


a modular back-office for node.js using angular.js and mongoDB.

so you want to build your next application / website / mobile app / REST api using the almighty powers of the MEAN stack, but you don't have the managemnt application to manage the data and operations, well,  nodulus to the rescue.

nodulus allows you to build and design your own back office modules *(nodules)* or use the predefined ones, while focusing on the exact actions you need to add to your managemnt consoles.
it uses a manifest file to define the nodule files, scripts, dependencies, routes etc.

### dependencies

1. [node.js](https://nodejs.org/en/)
2. npm (will install with the node.js installation)
3. [mongoDB](https://www.mongodb.org/) or try  [mongolab](https://mongolab.com/)

### setup & first run

1. clone the repo
2. run `npm install`
3. run `start.bat`

use the configuration file at /config/site.json to set the database name and the application port, default port is 3001.




## nodule development


### the manifest.json file
```
{
"module": {
    "name": "my_module_name" // the name for the module
  },
  "files": [ // a list of file to include in the root folder of the nudule, and pack in the nodule zip file
    "somescript.js",
    "apage.html"    
  ],
  "scripts": [// a list of scripts to load 
    "3partyscript.js"
    
  ],
  "dependencies": [
	"angular_dependency_module_name" // a dependency to be injected to the main app 
  ],
  "routes": [ // express routes for server proccessing
    {
      "route": "/route_base_entry_point",
      "path": "route_file_name"
    }
  ],
  
  "npm": {
	"package_name": "package_version", //e.g. "^1.5.0"  - npm packages to be installed when installing the module
  },
  "navigation": [ //module navigation options
	  {
		  "_id": "unique_id_name",
		  "ParentId": "00000000-0000-0000-0000-000000000000", // a parent_id used to create a hierarchy
		  "Name": "some_name",
		  "label": "some_display_name",
		  "Url": "/modules/module_name/page_name.html"
		   
		}
  ]



}
```
### pack & install

apart from setting up nodules you can use nodulus to pack a development nodule for reuse and distribution. use the modules tab to access the installed nodules list, and the `pack` option to zip all the files registered in the manifest into a zip file (nodule package).
the pack proccess will keep a copy of your last package for backup and version comparision.

packages are installed and packed to the `nodulus_modules` folder in the root folder of the application.




### built in API data access

a nodule can perform data operations via the built in REST api, just use the "/api/collection_name", as the endpoint of your ngResource object.



### stock nodules

#### users

provide basic email/password authentication.


#### modules

the package setup and package proccess

#### schemas

form generation based on the [schemaform.io](http://schemaform.io)
the nodule contains basic form elements and a form designer along with a lobby, item page, search, server side paging, subforms and validations.


#### translations
nodulus can be translated using this nodule (todo - add  translation via the manifest file)
 

##### Login screen
﻿![Alt text](platform-images/login-screen.jpg?raw=true "Login")

##### Modules setup
﻿![Alt text](platform-images/modules.jpg?raw=true "Modules")

