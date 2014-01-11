
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

exports["Don't substitute not found variable"] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('w', sl.createVariable('z'));
    test.ok(result);
    test.equal(result.toString(), "\\x.y");
};


