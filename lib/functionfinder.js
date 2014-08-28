var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var assert = require("assert");



function getFunction(rootPath,fnName){
    var node = rootPath.node;
    types.visit(node,{
        visitFunctionExpression : function(path){

            //assignment
            if(path.name === "right"){
                //we are in the right segment of an assignment
                var assignmentPath = path.parentPath;
                assert.ok(assignmentPath.name,"expression");
                var assignnode = assignmentPath.node;
                if(n.AssignmentExpression.check(assignnode)){
                    var assignedFunctionName = helper.getEndObject(assignnode.left);
                    if(assignedFunctionName === fnName){
                        console.warn(fnName," origin found at ",helper.getLine(assignmentPath));
                    }
                }
            }
            //init

            this.traverse(path);
        },
        visitFunctionDeclaration : function(path){
            var node = path.node;
            if(helper.getEndObject(node.id) === fnName){
                console.warn(fnName," origin found at ",helper.getLine(path));
            }
            this.traverse(path);
        }
    });
}


module.exports = {
    getFunction: getFunction
};