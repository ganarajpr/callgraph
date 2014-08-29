var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var assignments = require("./assignments");
var fn = require("./functionfinder");
var fo = require("./followobject");
var _ = require("lodash");


function build(files) {

    //cq.js
    var file = files[1];
    console.log(_.pluck(files, 'path'));
    //console.warn("Processing ", _file.path);
    visitCalls(file.ast);
}


function visitCalls(ast) {
    types.visit(ast, {
        visitCallExpression: function (path) {

            //If its an identifier there are a few choices :
            // something was assigned to a local identifier ... var x = _.first ; x();
            // There is a function declaration with that name in this scope hierarchy
            // Its a global.

            //TODO: if end object is call or apply handle it differently.

            var node = path.node;
            console.log("Finding root of ", helper.getFullAccessorList(node).join(".") , " at ", helper.getLine(path));
            var co = helper.getRootObject(node.callee);
            if (co === "this") {
                //it needs to follow a different path.
                console.log("Its a this - to be done later.")
            }
            else {
                fo.follow(path,helper.getFullAccessorList(node));
                   //TODO:How to handle require'ed functions.
                   //TODO:figure out a way to follow functions passed like this to globals like Array.forEach etc..

            }
            console.log("_____________________________________________________");
            this.traverse(path);
        }
    })
}


module.exports = {
    build: build
};
