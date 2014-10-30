/**
 * Created by ganara.jpermunda on 30/10/2014.
 */
var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var _ = require("lodash");


function Scope(path,parent){
    this.path = path;
    var scope = path.scope;
    this.parent = parent;
    this.childScopes = [];
    if(parent){
        parent.childScopes.push(this);
    }
    this.bindings = scope.getBindings();
    this.depth = scope.depth;
    this.node = scope.node;
}


function run(ast){

    var rootScope;
    var scopes = {};
    var currentScope;

    function addToScopePathMap(path,currentScope){
        var scopePath = path.scope.path;
        var fullPath = helper.getFullPath(scopePath);
        scopes[fullPath] = currentScope;
    }

    types.visit(ast, {
        visitProgram : function(path){
            rootScope = new Scope(path,null);
            currentScope = rootScope;
            addToScopePathMap(path,currentScope);
            this.traverse(path);
        },
        visitFunction: function (path) {
            var scope = new Scope(path,currentScope);
            currentScope = scope;
            addToScopePathMap(path,currentScope);
            this.traverse(path);
            currentScope = currentScope.parent;
        },
        visitCatchClause : function(path){
            var scope = new Scope(path,currentScope);
            currentScope = scope;
            addToScopePathMap(path,currentScope);
            this.traverse(path);
            currentScope = currentScope.parent;
        }
    });
    return {
        rootScope: rootScope,
        pathToScope : scopes
    };
}




module.exports = {
    run: run
};