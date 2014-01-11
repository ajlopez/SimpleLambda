
var sl = require('..');

exports['Create lambda'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    test.ok(l);
    test.equal(l.toString(), "\\x.y");
};