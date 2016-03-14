///runjs middleware
///@2016 roi ben haim
///ewave open source
///
///
///
//////////////////////////////////////////////////////////////////////////////////////////

//console.log("nodulus.run middleware load");
var fs = require("fs");
global.nodulus = {
    classes: require('./classes.js'),
    parser: require('./parser.js'),
    renderer: require('./renderer.js'),
    runner: require('./runner.js')

}


////var control_mapping = {};
////var fileContent = fs.readFileSync("config/controls.json", "utf-8");
////var c_arr = JSON.parse(fileContent);
////for (var i = 0; i < c_arr.length; i++) {
////    control_mapping[c_arr[i].name] = new global.nodulus.classes.ControlClass(c_arr[i]);
////}

//////console.log("nodulus.run control mapping:: " + JSON.stringify( control_mapping));
////global.nodulus.control_mapping = control_mapping;






function recurseme(context, callback) {
    global.nodulus.runner.run(context, function (result) {
        var a = result.indexOf("run_");
        var b = result.indexOf("run__");

        if (a > -1 && a != b)
            recurseme(context, callback);
        else {
            var result = global.nodulus.renderer.renderMaster(context.page);
            callback(result);
        }

    }, function (error) {

        callback(error);

    });
}


module.exports = function (req, res, next) {
    //we handle only no extension requests
    if (req.url.indexOf('.') == -1) {
        var context = new global.nodulus.classes.Context(req, res);
        recurseme(context, function (result) {

            context.res.send(result);
        });


    }
    else {
        //this is not a run page, move on
        next();
    }
}





