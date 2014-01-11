
var sl = require('..');

exports['Create variable'] = function (test) {
    var v = sl.createVariable('x');
    
    test.ok(v);
    test.equal(v.toString(), 'x');
}

