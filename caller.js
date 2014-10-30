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

/*
Points of  value creation ( object expr, array expr, literal , new expr ) - unique id ? Hash ? How ?
    Points of symbol creation ( definitions) - done!
    Points of propagation ( assignments, calls ) - digest loop.
    Points of access - ( expressions )

Symbol assignments - create a list head of list contains all symbols that have values or types . head ptr. Untyped ptr . untyped length should not be same as last loop - or if a type was found.

    Typed list and untyped list .

    Initially everything is in untyped list. Per context.

    In creation pass we move things to typed list. Definitely typed vars then in propagation phase we move things to typed phase if some symbol is assigned to a typed one.

    Resolving new expressions !*/
