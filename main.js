var esprima = require('esprima');
var fs = require('vinyl-fs');
var map = require('map-stream');

var callsite = require('./lib/callsite');

var files = [];
var esprimaOptions = {
    tolerant : true

};

function withEachFile(file,next){
    storeFile(file);
    next(null,file);
}


function storeFile(file){
    if(file._contents){
        var contentString = file._contents.toString();
        try{
            files.push({
                path : file.path,
                content : contentString,
                ast : esprima.parse(contentString,esprimaOptions)
            });
        }
        catch(c){
            //console.warn(file.path);
        };

    }
}

function onAllRead(){
    callsite.build(files);
}


module.exports.process = function(glob){
    var r = fs.src(glob);
        r.pipe(map(withEachFile));
    r.on('end',onAllRead);

};


