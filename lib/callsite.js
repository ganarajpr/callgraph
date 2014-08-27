
var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var _ = require("lodash");


function build(files){
    var file = files[1];
    console.log(_.pluck(files,'path'));
    //console.warn("Processing ", _file.path);
    visitCalls(file.ast);
}


function visitCalls(ast){
    types.visit(ast,{
        visitCallExpression : function(path){

            if(n.Identifier.check(path.value.callee) &&
                path.value.callee.name === 'require'){
                //do nothing for now.
                //This will also be a global.
            }
            else{
                console.log("Finding root of ",helper.getEndObject(path.value.callee), " at ", helper.getLine(path));
                var co = helper.getRootObject(path.value.callee);

                if(co === "this"){
                    //it needs to follow a different path.
                }
                else{
                    var scopeOfCallingObject = path.scope.lookup(co);
                    if(scopeOfCallingObject){
                        console.log("Origin object is ",co);
                        visitAssignmentsLookingFor(scopeOfCallingObject.path,co);
                    }
                    else{
                        //do something to figure out if it is a global.
                        console.log(co, "Scope not found - global or undefined");
                    }
                }

            }
            this.traverse(path);
        }
    })
}

function checkIfAssignedAt(path,rootPath,rootName){
    var node = path.node;
    if(n.Identifier.check(node.left) &&
        node.left.name === rootName){
        console.log(node.left.name," is assigned at ",helper.getLine(path));
    }
}

function checkIfInitializedAt(path,rootPath,rootName){
    var node = path.node;
    if(n.Identifier.check(node.id) &&
        node.id.name === rootName){
        console.log(node.id.name," is assigned at ",helper.getLine(path));
    }
}

function visitAssignmentsLookingFor(rootPath,rootName){
    types.visit(rootPath.node,{
        visitAssignmentExpression : function(path){
            checkIfAssignedAt(path,rootPath,rootName);
            this.traverse(path);
        },
        visitVariableDeclarator:function(path){
            checkIfInitializedAt(path,rootPath,rootName);
            this.traverse(path);
        }
    });
}


module.exports = {
    build : build
};
