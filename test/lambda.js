var sl = require('..');

exports['Create lambda'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    test.ok(l);
    test.equal(l.toString(), "\\x.y");
};

exports['Substitute bound variable does nothing'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('x')); //   \x.x
    
    var result = l.substitute('x', sl.createVariable('y'));
    test.ok(result);
    test.equal(result.toString(), "\\x.x");
};

exports['Substitute non-bound variable'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('z'));
    
    var result = l.substitute('y', sl.createVariable('z'));
    test.ok(result);
    test.equal(result.toString(), "\\x.z");
};

exports['Substitute non-bound variable and replace bound variable that is free in new term'] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('y', sl.createVariable('x'));
    test.ok(result);
    test.equal(result.toString(), "\\z.x");
};

exports['Alpha-conversion does not confusingly use the names of free variables'] = function (test) {
  var l = sl.parse('(\\x.\\x.x)p');

  var result = l.reduce();
  test.ok(result);
  test.equal(result.toString(), "\\x.x");
};

exports['Alpha-conversion works also for the variable q'] = function (test) {
  var l = sl.createLambda('x', sl.createVariable('q'));

  var result = l.substitute('q', sl.createVariable('x'));
  test.ok(result);
  test.equal(result.toString(), "\\y.x");
};

exports['Substitute and change argument by fresh variable'] = function (test) {
    var l = sl.parse('\\x.y');
    
    var result = l.substitute('y', sl.parse('abcx'));
    test.ok(result);
    test.equal(result.toString(), "\\z.abcx");
};

exports["Don't substitute not found variable"] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('w', sl.createVariable('z'));
    test.ok(result);
    test.equal(result.toString(), "\\x.y");
};

exports["Don't substitute bound variable by a non-variable term"] = function (test) {
    var l = sl.createLambda('x', sl.createVariable('y'));
    
    var result = l.substitute('x', sl.createLambda('y', sl.createVariable('z')));
    test.ok(result);
    test.equal(result.toString(), "\\x.y");
};

exports['Alpha-conversion generates longer names when all short names are exhausted'] = function (test) {
  var l = sl.createLambda('x', sl.parse('xyzwvutsrabcdefghijklmnopq'));
  var m = l.substitute('q',sl.createVariable('x'));
  test.equal(m.toString(), "\\v0.v0yzwvutsrabcdefghijklmnopx");
  var result = m.substitute('p', sl.createApply(sl.parse('xq'),sl.createVariable('v0')));
  test.ok(result);
  test.equal(result.toString(), "\\v1.v1yzwvutsrabcdefghijklmno(xqv0)x");
};



