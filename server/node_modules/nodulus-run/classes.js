var fs = require("fs");

module.exports.Context = function (req, res) {
    this.req = req;
    this.res = res;

    if (this.req.navigation) {
        this.req.runningPage = req.navigation.DisplayFile.FileName;
    }
    else {
        this.req.runningPage = "pages/" + req.originalUrl + ".html";
    }

}




module.exports.Page = function (context) {
    var filename = context.req.runningPage
    var pageInstance = this;
    pageInstance.contents = {};
    pageInstance.fileContent = fs.readFileSync(filename, "utf-8");
    pageInstance.fileContent = pageInstance.fileContent.replace(/run::/g, 'run__');
    pageInstance.fileContent = pageInstance.fileContent.replace(/run:/g, 'run_');

    pageInstance.script = require(global.appRoot + "/" + filename.replace(".html", ".js"));
    this.run = function (callback) {
        pageInstance.script.init(context, pageInstance, function () {
            callback();
        });
    }
}

module.exports.MasterPage = function (context, attributes) {
    var filename = attributes.masterpagefile;
    var pageInstance = this;

    pageInstance.fileContent = fs.readFileSync(filename, "utf-8");
    pageInstance.fileContent = pageInstance.fileContent.replace(/run::/g, 'run__');
    pageInstance.fileContent = pageInstance.fileContent.replace(/run:/g, 'run_');

    pageInstance.script = require(global.appRoot + "/" + filename.replace(".master", ".js"));
    pageInstance.placeholders = {};
    this.run = function (callback) {
        pageInstance.script.init(context, pageInstance, function () {
            callback();
        });
    }

    this.merge = function (page) {



    }
    return this;

}

module.exports.PlaceHolder = function (attributes) {
    this.placeholders = [];
}



module.exports.Control = function (namespace, name) {
    var folder = "";
    if (namespace === "run") {
        folder = "/controls/";
    }
    else {
        folder = "/" + namespace.replace(/_/g, '/') + "/";
    }
    
    this.name = name;
    this.namespace = namespace;
    this.type = {
        "name": name,
        "path": folder + name + ".js",
        "template": fs.readFileSync(global.appRoot + folder + name + ".html", "utf-8"),
        script: require(global.appRoot + folder + name + ".js")
    }
}


module.exports.ControlClass = function (data) {
    this.name = data.name;
    this.template = fs.readFileSync(global.appRoot + data.template, "utf-8");;
    this.path = data.path;
    this.script = require(global.appRoot + data.path);
}
