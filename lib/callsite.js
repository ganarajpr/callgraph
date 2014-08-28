var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var assignments = require("./assignments");
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
            /*if (n.Identifier.check(path.node.callee) ){
                console.log( "Root object for identifier is ", helper.getEndObject(path.value.callee));
                //TODO:Dont ignore it if its a require. ignore it if its a global
                if(path.node.callee.name === 'require') {
                    //do nothing for now.
                    //This will also be a global.
                }
            }
            else {*/
            console.log("Finding root of ", helper.getEndObject(path.value.callee), " at ", helper.getLine(path));
            var co = helper.getRootObject(path.value.callee);
            console.log("Origin object is ", co);
            if (co === "this") {
                //it needs to follow a different path.
            }
            else {
                var scopeOfCallingObject = path.scope.lookup(co);
                if (scopeOfCallingObject) {
                    assignments.getAssignmentPaths(scopeOfCallingObject.path, co);
                }
                else {
                    //do something to figure out if it is a global.
                    console.log(co, "Scope not found - global or undefined");
                }
            }

            //}
            this.traverse(path);
        }
    })
}




module.exports = {
    build: build
};
