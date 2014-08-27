var esprima = require('esprima');
var fs = require('vinyl-fs');
var map = require('map-stream');

var files = [];

function withEachFile(file){

    storeFile(file);

}


function storeFile(file){
    if(file._contents){
        var contentString = file._contents.toString();
        files.push({
            path : file.path,
            content : contentString,
            ast : esprima.parse(contentString)
        });
    }
}

function onAllRead(){

}


module.exports.process = function(glob){
    fs.src(glob)
        .pipe(map(withEachFile))
        .pipe(onAllRead);
};


