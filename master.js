var cp = require('child_process');
var path = require('path');
var child = cp.fork(path.join(__dirname, 'app.js'), [], {
    execArgv: ["--debug=9999"]
});

child.on('close', function (code) {
    console.log('closing code: ' + code);
});

child.on('message', function (m) {
    if (m === 'update nodulus') {
        console.log(m);
        child.kill("SIGINT");
        // Receive results from child process
        var checkUtil = require("@nodulus/update").check;
        var updateUtil = require("@nodulus/update").update;
        var c = new checkUtil();
        c.checkUpdates().then((upgraded) => {
            console.log(upgraded);
            if (upgraded) {
                var n = new updateUtil();
                n.installUpdates(upgraded).then(function (output) {
                    console.log(output);

                    child = cp.fork(path.join(__dirname, 'app.js'), [], {
                        execArgv: ["--debug=9999"]
                    });
                    console.log(output);
                });
            }
        });
    }


});
