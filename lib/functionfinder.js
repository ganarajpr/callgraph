var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");



function getFunction(rootPath,fnName){
    var node = rootPath.node;
    types.visit(node,{
        visitFunction : function(path){
            var node = path.node;
            if(n.FunctionDeclaration.check(node)){
                if(n.id === fnName){
                    console.warn(fnName , "found at ",helper.getLine(path));
                }
            }
            this.traverse(path);
        }
    });
}


module.exports = {
    getFunction: getFunction
};