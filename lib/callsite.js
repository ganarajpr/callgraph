
var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var _ = require("lodash");


function build(files){
    var file = _.first(files);
    visitCalls(file.ast);
}


function visitCalls(ast){
    types.visit(ast,{
        visitCallExpression : function(path){

            if(n.Identifier.check(path.value.callee) &&
                path.value.callee.name === 'require'){
                //do nothing for now.
            }
            else{
                var co = helper.getRootObject(path.value.callee);
                var scopeOfCallingObject = path.scope.lookup(co);
                if(scopeOfCallingObject){
                    console.log(co, helper.getFullPath(scopeOfCallingObject.path));
                }
                else{
                    console.log(co, "Scope not found");
                }

            }
            this.traverse(path);
        }
    })
}


module.exports = {
    build : build
};
