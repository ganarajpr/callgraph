var n = require("ast-types").namedTypes;
var _ = require("lodash");

function getFullPath(path){
    var fpath = fullPath(path);
    var fpathReverse = fpath.reverse().join('.');
    return fpathReverse;
}


function fullPath(path){
    var pathNameArray = [];
    if(path){
        pathNameArray.push(path.name);
        pathNameArray = pathNameArray.concat(fullPath(path.parent));
    }
    return pathNameArray;
}

/*
* If you pass an ast for something like a.b.c it will return a
*
* */

function getRootObject(expr){
    if(n.Identifier.check(expr)){
        return expr.name;
    }
    if(n.MemberExpression.check(expr)){
        return getRootObject(expr.object);
    }
    if(n.CallExpression.check(expr)){
        return getRootObject(expr.callee);
    }
    if(n.ThisExpression.check(expr)){
        return "this";
    }
    console.log(expr,"unknown root object type");
}

function getLineNumberForPath(path){
    return path.node.loc.start.line;
}

function getEndObject(expr){
    if(n.Identifier.check(expr)){
        return expr.name;
    }
    if(n.MemberExpression.check(expr)){
        return getEndObject(expr.property);
    }
}

function getFullAccessorList(expr){
    var list = [];
    if(n.Identifier.check(expr)){
        list.push(expr.name);
    }
    else if(n.MemberExpression.check(expr)){
        list = list.concat(getFullAccessorList(expr.object));
        list = list.concat(getFullAccessorList(expr.property));
    }
    else if(n.CallExpression.check(expr)){
        list = list.concat(getFullAccessorList(expr.callee));
    }
    else if(n.ThisExpression.check(expr)){
        list.push("this");
    }
    else{
        console.warn("Get Full Accessor failed for ", expr.type)
    }
    return list;
}

module.exports = {
    getFullPath : getFullPath,
    getRootObject : getRootObject,
    getEndObject : getEndObject,
    getLine : getLineNumberForPath,
    getFullAccessorList : getFullAccessorList
};
