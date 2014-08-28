var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var assignments = require("./assignments");
var fn = require("./functionfinder");
var fo = require("./followobject");
var _ = require("lodash");


function build(files) {

    //cq.js
    var file = files[2];
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
            var currentCall = helper.getEndObject(node.callee);
            console.log("Finding root of ", helper.getFullAccessorList(node).join(".") , " at ", helper.getLine(path));
            var co = helper.getRootObject(node.callee);
            if (co === "this") {
                //it needs to follow a different path.
            }
            else {
                fo.follow(path,helper.getFullAccessorList(node));
                /*var scopeOfCallingObject = path.scope.lookup(co);
                if (scopeOfCallingObject) {
                    //The root object is the same as current call end object (its an identifier ? ) .
                    //TODO:How to handle require'ed functions.

                    if(n.Identifier.check(node.callee) && co === currentCall){
                        fn.getFunction(scopeOfCallingObject.path,co);
                    }

                    var assigns = assignments.getAssignmentPaths(scopeOfCallingObject.path, co);
                    //TODO:figure out a way to follow functions passed like this to globals like Array.forEach etc..
                    _.map(assigns,assignments.followAssignment);
                }
                else {
                    //do something to figure out if it is a global.
                    console.log(co, "is global");
                }*/
            }
            console.log("_____________________________________________________");
            this.traverse(path);
        }
    })
}


module.exports = {
    build: build
};
