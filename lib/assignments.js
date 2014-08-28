var types = require("ast-types");
var n = require("ast-types").namedTypes;
var helper = require("./helpers");

function checkIfAssignedAt(path, rootName) {
    var node = path.node;
    if (n.Identifier.check(node.left) &&
        node.left.name === rootName) {
        console.log(node.left.name, " is assigned at ", helper.getLine(path));
        return true;
    }
    return false;
}

function checkIfInitializedAt(path, rootName) {
    var node = path.node;
    if (n.Identifier.check(node.id) &&
        node.id.name === rootName) {
        console.log(node.id.name, " is assigned at ", helper.getLine(path));
        return true;
    }
    return false;
}

function getAssignmentPaths(rootPath, rootName) {

    var paths = [];

    types.visit(rootPath.node, {
        //TODO:When finding all assignments ensure that the lower scopes dont override the current rootname ( because that would be something else)
        visitAssignmentExpression: function (path) {

            if(checkIfAssignedAt(path, rootName)){
                paths.push(path);
            }
            this.traverse(path);
        },
        visitVariableDeclarator: function (path) {
            if(checkIfInitializedAt(path, rootName)){
                paths.push(path);
            }
            this.traverse(path);
        }
    });

    return paths;
}


module.exports = {
    getAssignmentPaths: getAssignmentPaths
};
