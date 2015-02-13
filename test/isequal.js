var sl = require('..');

exports['Two vars are equal when they are identical'] = function (test) {
  var l1 = sl.createVariable('y');
  var l2 = sl.createVariable('y');

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), true);
};

exports['Two vars are not equal when they are not identical'] = function (test) {
  var l1 = sl.createVariable('x');
  var l2 = sl.createVariable('y');

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), false);
};

exports['Two lambdas are equal when they are identical'] = function (test) {
  var l1 = sl.createLambda('x', sl.createVariable('y'));
  var l2 = sl.createLambda('x', sl.createVariable('y'));

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), true);
};

exports['Two lambdas are equal when they are equivalent by alpha-conversion not involving bound variable'] = function (test) {
  var l1 = sl.createLambda('x', sl.createVariable('y'));
  var l2 = sl.createLambda('z', sl.createVariable('y'));

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), true);
};

exports['Two lambdas are equal when they are equivalent by alpha-conversion involving bound variable'] = function (test) {
  var l1 = sl.createLambda('x', sl.createVariable('x'));
  var l2 = sl.createLambda('z', sl.createVariable('z'));

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), true);
};

exports['Two lambdas are equal when they are equivalent by alpha-conversion involving deeper nesting'] = function (test) {
  var l1 = sl.parse('\\x.\\y.x(\\z.\\t.txyz)');
  var l2 = sl.parse('\\a.\\b.a(\\c.\\d.dabc)');

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), true);
};


exports['Two lambdas are not equal when they are not equivalent'] = function (test) {
  var l1 = sl.createLambda('x', sl.createVariable('y'));
  var l2 = sl.createLambda('y', sl.createVariable('y'));

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), false);
};

exports['Two applications are equal when they are identical'] = function (test) {
  var l1 = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
  var l2 = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));

  test.ok(l1);
  test.ok(l2);
  test.equal(sl.isEqual(l1, l2), true);
};


