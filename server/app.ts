/// <reference path="typings/main.d.ts" />

/// <reference path="typings/nodulus/nodulus.d.ts" />

/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
 

import * as nodulus from "./app/startup";
global.appRoot = __dirname;
module.exports = new nodulus.Startup();


 