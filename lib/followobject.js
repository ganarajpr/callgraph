var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var assert = require("assert");
var _ = require("lodash");
var assigns = require("./assignments");
var fn = require("./functionfinder");

function follow(rootPath,list){
    console.log("following ", list.join("."));
    var accessor = _.first(list);
    //find scope for the accessor
    var scope = rootPath.scope.lookup(accessor);
    if(!scope){
        console.log( accessor ,"is global ?");
        return;
    }
    if(list.length === 1){
        //this is the end
        return fn.getFunction(scope.path,accessor);
    }
    else{

        getInfo(scope,accessor);
        var assignPaths = assigns.getAssignmentPaths(scope.path,accessor);
        //TODO:Figure out what to do with multiple assignment paths.
        var followedPaths = _.map(assignPaths,function(p){
            var aNode = p.node;
            var rightAccessorList = helper.getFullAccessorList(aNode.right || aNode.init);
            //combine rightAccessorList with the rest.
            var combinedList = rightAccessorList.concat(_.rest(list));
            return follow(p,combinedList);
        });
        return followedPaths[0];
    }

}


function getInfo(scope,accessor){
    var abind = scope.bindings[accessor];
    var defpath = findDefiningPath(abind[0].parentPath);
    console.log(defpath.name);

}

var definingPaths = [ 'declarations','params'];

function findDefiningPath(path){

    if(_.contains(definingPaths,path.name)){
        return path;
    }
    else if(path.parentPath){
        return findDefiningPath(path.parentPath);
    }
    else{
        return;
    }
}


module.exports = {
    follow: follow
};