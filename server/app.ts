/*                 _       _           
                 | |     | |          
  _ __   ___   __| |_   _| |_   _ ___ 
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @ewave open source | ©Roi ben haim  ®2016    
 */
/// <reference path="typings/node/node.d.ts" />
/// <reference path="classes/startup" />

 
global["appRoot"] = __dirname;
import * as nodulus from "./classes/startup";

module.exports = new nodulus.Startup();


 