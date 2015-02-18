var sl = require('..');

//exports['Alpha conversion of a variable'] = function (test) {
//  var a = sl.createVariable('y');
//
//  var b = a.alphaConvert('y', 'z');
//  test.equal(b.toString(), 'z');
//};
//
//exports['Alpha conversion of a variable that has a different name'] = function (test) {
//  var a = sl.createVariable('x');
//
//  var b = a.alphaConvert('y', 'z');
//  test.equal(b.toString(), 'x');
//};

// alpha conversion is only defined for lambda terms
exports['Alpha conversion of a lambda'] = function (test) {
  var a = sl.createLambda('x', sl.createVariable('x'));

  var b = a.alphaConvert('x', 'z');
  test.equal(b.toString(), '\\z.z');
};

exports['Alpha conversion of a lambda for a variable that is not bound'] = function (test) {
  var a = sl.createLambda('x', sl.createVariable('y'));

  var b = a.alphaConvert('y', 'z');
  test.equal(b.toString(), '\\x.y');
};

exports['Alpha conversion of a lambda with non-variable body'] = function (test) {
  var c = sl.parse('\\x.yxz').substitute('y', sl.createVariable('q'));
  test.equal(c.toString(), '\\x.qxz');
};
exports['Alpha conversion of a lambda with nested body'] = function (test) {
  var a = sl.parse('\\x.\\y.xy(\\x.x)z');
  var b = a.alphaConvert('x', 't');
  test.equal(b.toString(), '\\t.\\y.ty(\\x.x)z');
};

//exports['Alpha conversion of an application'] = function (test) {
//  var a = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
//
//  var b = a.alphaConvert('x', 'z');
//  test.equal(b.toString(), 'zy');
//};
