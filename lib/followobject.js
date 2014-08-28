var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");
var assert = require("assert");
var _ = require("lodash");
var assigns = require("./assignments");
var fn = require("./functionfinder");



/*function follow(rootPath,list){

    var accessor = _.first(list);
    //find scope for the accessor
    var scope = rootPath.scope.lookup(accessor);
    if(!scope){
        console.warn( accessor ,"is global ?");
        return;
    }

    if(list.length === 1){
        //this is the end
        return fn.getFunction(scope.path,accessor);
    }
    else{
        var rest = _.rest(list);
        //find accessor location scope
        var assignPaths = assigns.getAssignmentPaths(scope.path,accessor);
        var followedPath = _.map(assignPaths,function(p){
            var aNode = p.node;
            var rightAccessorList = helper.getFullAccessorList(aNode.right || aNode.init);
            return follow(p,rightAccessorList);
        });
        if(followedPath.length > 1){
            console.warn("Return only the first path found");
        }
        return followedPath[0];
    }



}*/

function follow(rootPath,list){
    console.log("following ", list.join("."));
    var accessor = _.first(list);
    //find scope for the accessor
    var scope = rootPath.scope.lookup(accessor);
    if(!scope){
        console.warn( accessor ,"is global ?");
        return;
    }
    if(list.length === 1){
        //this is the end
        return fn.getFunction(scope.path,accessor);
    }
    else{
        var assignPaths = assigns.getAssignmentPaths(scope.path,accessor);
        //hopefully there is only 1 assignedPath
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


module.exports = {
    follow: follow
};