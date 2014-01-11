
var sl = require('..');

exports['Create variable'] = function (test) {
    var v = sl.createVariable('x');
    
    test.ok(v);
    test.equal(v.toString(), 'x');
}

exports['Substitute variable'] = function (test) {
    var v = sl.createVariable('x');
    var v2 = sl.createVariable('y');
    var result = v.substitute('x', v2);
    
    test.ok(result);
    test.equal(result.toString(), 'y');
    test.strictEqual(result, v2);
}

exports["Don't substitute variable"] = function (test) {
    var v = sl.createVariable('x');
    var v2 = sl.createVariable('z');
    var result = v.substitute('y', v2);
    
    test.ok(result);
    test.equal(result.toString(), 'x');
    test.strictEqual(result, v);
}

