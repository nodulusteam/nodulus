var cp = require('child_process');
var child = cp.fork('./app',[], {
  execArgv: ["--debug=9999"]
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

                    child = cp.fork('./app');
                    console.log(output);
                });
            }
        });
    }


});

// Send child process some work
child.send('Please up-case this string');