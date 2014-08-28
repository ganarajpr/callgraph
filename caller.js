var callgraph = require('./main');
var resolve = require("resolve");


var dir = '../Ngprima/codequery/*.js';


/*var opts = {
    basedir : dir
};


resolve("./codequery/cq",opts,function(err,res){
    console.log(res);
});*/


callgraph.process(dir);

