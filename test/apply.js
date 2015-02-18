var sl = require('..');

exports['Create apply'] = function (test) {
    var a = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
    
    test.ok(a);
    test.equal(a.toString(), 'xy');
};

exports['Create apply with left apply'] = function (test) {
    var a = sl.createApply(sl.createApply(sl.createVariable('x'), sl.createVariable('y')), sl.createVariable('z'));
    
    test.ok(a);
    test.equal(a.toString(), 'xyz');
};

exports['Create apply with right apply'] = function (test) {
    var a = sl.createApply(sl.createVariable('x'), sl.createApply(sl.createVariable('y'), sl.createVariable('z')));
    
    test.ok(a);
    test.equal(a.toString(), 'x(yz)');
};

exports['Substitute left variable'] = function (test) {
    var a = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
    
    var result = a.substitute('x', sl.createVariable('z'));
    
    test.ok(result);
    test.equal(result.toString(), 'zy');
};

exports['Substitute right variable'] = function (test) {
    var a = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
    
    var result = a.substitute('y', sl.createVariable('z'));
    
    test.ok(result);
    test.equal(result.toString(), 'xz');
};

exports["Don't substitute not found variable"] = function (test) {
    var a = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
    
    var result = a.substitute('w', sl.createVariable('z'));
    
    test.ok(result);
    test.strictEqual(result, a);
    test.equal(result.toString(), 'xy');
};
