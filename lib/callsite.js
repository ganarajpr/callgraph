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
    //console.log(Object.keys(scopeInfo.pathToScope));
    visitCreations(file.ast,scopeInfo);
}

function isInitOrAssignmentPath(path){
    return path.name === 'init' ||  ( path.name === 'right' && path.parentPath.name === 'expression');
}

function isInitPath(path){
    return path.name === 'init';
}

function isAssignmentPath(path){
    return path.name === 'right' && path.parentPath.name === 'expression';
}


function findScope(scopeInfo,path){
    var fullPath = helper.getScopeFullPath(path);
    return scopeInfo.pathToScope[fullPath];
}

function getInitializedVariable(path){
    var node = path.parentPath.node;
    return node.id.name;
}

function getAssignedVariable(path){
    var node = path.parentPath.node;
    return helper.getFullAccessorList(node.left).join('.');
}

function getTheVariable(path,type){
    if(isInitPath(path)){
        //var myscope = findScope(scopeInfo,path);
        var initedVar = getInitializedVariable(path);
        console.log('inited var ', initedVar);
        console.log(type, ' ',path.node.loc.start.line , ' ' ,helper.getFullPath(path) );
    }

    if(isAssignmentPath(path)){
        //var myscope = findScope(scopeInfo,path);
        var assignedVar = getAssignedVariable(path);
        console.log('assigned var ', assignedVar);
        console.log(type, ' ',path.node.loc.start.line , ' ' ,helper.getFullPath(path) );
    }
}


function visitCreations(ast,scopeInfo){
    types.visit(ast, {
        visitObjectExpression: function (path) {
            //console.log('object ',path.node.loc.start.line , ' ' ,helper.getFullPath(path));
            getTheVariable(path,'object');
            this.traverse(path);
        },
        visitArrayExpression : function(path){
            //console.log('array ',path.node.loc.start.line , ' ' ,helper.getFullPath(path));
            getTheVariable(path,'array');
            this.traverse(path);
        },
        visitNewExpression : function(path){
            //console.log('new ',path.node.loc.start.line , ' ' ,helper.getFullPath(path));
            getTheVariable(path,'new');
            this.traverse(path);
        },
        visitLiteral : function(path){
            getTheVariable(path,'literal');
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
