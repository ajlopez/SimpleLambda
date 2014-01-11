
var sl = require('..');

exports['Create lambda'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    test.ok(l);
    test.equal(l.toString(), "\\x.y");
};

exports['Substitute bound variable'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('x'));
    
    var result = l.substitute('x', sl.createVariable('y'));
    test.ok(result);
    test.equal(result.toString(), "\\y.y");
};

exports['Substitute not bound variable'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('z'));
    
    var result = l.substitute('y', sl.createVariable('z'));
    test.ok(result);
    test.equal(result.toString(), "\\x.z");
};

exports['Substitute not bound variable and replace bound variable that is free in new term'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('y', sl.createVariable('x'));
    test.ok(result);
    test.equal(result.toString(), "\\z.x");
};

exports['Substitute and change argument by fresh variable'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('y', sl.parse('abcx'));
    test.ok(result);
    test.equal(result.toString(), "\\d.abcx");
};

exports["Don't substitute not found variable"] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('w', sl.createVariable('z'));
    test.ok(result);
    test.equal(result.toString(), "\\x.y");
};

exports["Don't substitute bound variable by a not variable term"] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('x', sl.createLambda('y', sl.createVariable('z')));
    test.ok(result);
    test.equal(result.toString(), "\\x.y");
};



