/// <reference path="server/typings/main.d.ts" />
"use strict";
/*                 _       _
                 | |     | |
  _ __   ___   __| |_   _| |_   _ ___
 | '_ \ / _ \ / _` | | | | | | | / __|
 | | | | (_) | (_| | |_| | | |_| \__ \
 |_| |_|\___/ \__,_|\__,_|_|\__,_|___/
 @nodulus open source | ©Roi ben haim  ®2016
 */
var forever = require('forever-monitor');
var child = new (forever.Monitor)('app.js', {
    max: 3,
    silent: true,
    args: []
});
child.on('exit', function () {
    console.log('your-filename.js has exited after 3 restarts');
});
child.start();
