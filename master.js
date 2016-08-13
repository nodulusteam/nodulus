var cp = require('child_process');
var child = cp.spawn('node', ["./node_modules/@nodulus/shell/app.js"]);//,['./app.js' , '--debug=9999'] );
// ,[], {
//   execArgv: ["--debug=9999"],
//   execPath: ["node.exe"]
// });

child.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
});
child.on('close', function(code) {
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

                    child = cp.fork('./app');
                    console.log(output);
                });
            }
        });
    }


});