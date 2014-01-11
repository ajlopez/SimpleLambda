
var sl = require('..');

exports['Reduce variable'] = function (test) {
    var v = sl.createVariable('x');
    
    var result = sl.reduce(v);
    
    test.ok(result);
    test.strictEqual(result, v);
}

exports['Reduce lambda'] = function (test) {
    var v = sl.createLambda('x', sl.createVariable('y'));
    
    var result = sl.reduce(v);
    
    test.ok(result);
    test.strictEqual(result, v);
}

exports['Reduce simple apply'] = function (test) {
    var v = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
    
    var result = sl.reduce(v);
    
    test.ok(result);
    test.strictEqual(result, v);
}
