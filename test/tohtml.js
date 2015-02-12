var sl = require('..');

exports['Print free variable'] = function (test) {
  var v = sl.parse('x');

  test.ok(v);
  test.equal(typeof v, 'object');
  test.equal(v.toHTML(), '<i><b>x</b></i>');
};

exports['Print lambda with two free variables'] = function (test) {
  var v = sl.parse('\\x.xyz');

  test.ok(v);
  test.equal(typeof v, 'object');
  test.equal(v.toHTML(), 'λ<i>x</i>→<i>x</i><i><b>y</b></i><i><b>z</b></i>');
};

exports['Print variables with subscripts'] = function (test) {
  var v = sl.parse('\\x.xy23z3');

  test.ok(v);
  test.equal(typeof v, 'object');
  test.equal(v.toHTML(), 'λ<i>x</i>→<i>x</i><i><b>y</b></i><sub>23</sub><i><b>z</b></i><sub>3</sub>');
};
