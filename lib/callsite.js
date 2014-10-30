var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var assignments = require("./assignments");
var fn = require("./functionfinder");
var fo = require("./followobject");
var _ = require("lodash");
var sc = require("./scopecreator");


function build(files) {

    //cq.js
    var file = files[2];
    console.log(_.pluck(files, 'path'));
    //console.warn("Processing ", _file.path);
    //visitCalls(file.ast);
    var scopeInfo = sc.run(file.ast);
    console.log(Object.keys(scopeInfo.pathToScope));
    //visitCreations(file.ast);
}


function visitCreations(ast){
    types.visit(ast, {
        visitObjectExpression: function (path) {
            console.log(path.scope);
            console.log('object ',path.node.loc.start.line , ' ' ,helper.getFullPath(path));
            this.traverse(path);
        },
        visitArrayExpression : function(path){
            console.log('array ',path.node.loc.start.line , ' ' ,helper.getFullPath(path));
            this.traverse(path);
        },
        visitNewExpression : function(path){
            console.log('new ',path.node.loc.start.line , ' ' ,helper.getFullPath(path));
            this.traverse(path);
        },
        visitLiteral : function(path){
            if(path.name === 'init' ||  ( path.name === 'right' && path.parentPath.name === 'expression') ){
                console.log('literal ',path.node.loc.start.line , ' ' ,helper.getFullPath(path) );
            }
            this.traverse(path);
        }
    })
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
            var scope = path.scope;
            //console.log(Object.keys(scope.getBindings()),scope.node.type);
            var co = helper.getRootObject(node.callee);
            if (co === "this") {
                //it needs to follow a different path.
                console.log("Its a this.");
                var node = scope.node;
                if(n.FunctionDeclaration.check(node)){
                    console.log(node.id.name);
                }
                if(n.FunctionExpression.check(node)){
                    console.log('fe');
                }
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
