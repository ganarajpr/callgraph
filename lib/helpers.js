var n = require("ast-types").namedTypes;


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
}



module.exports = {
    getFullPath : getFullPath,
    getRootObject : getRootObject
};
