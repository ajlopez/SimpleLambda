var sl = require('..');

exports['Parse variable'] = function (test) {
    var v = sl.parse('x');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'x');
};

exports['Parse variable skipping spaces'] = function (test) {
    var v = sl.parse('  x   ');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'x');
};

exports['Parse two variables'] = function (test) {
    var v = sl.parse('xy');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xy');
};

exports['Parse capitalized variable skipping spaces'] = function (test) {
    var v = sl.parse(' Capitalized');

    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'Capitalized');
};

exports['Parse three variables, two capitalized'] = function (test) {
    var v = sl.parse('xYgrecZed');

    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xYgrecZed');
};

exports['Parse three variables, two capitalized, ignoring spaces'] = function (test) {
    var v = sl.parse('xYgrec Zed ');

    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xYgrecZed');
};

exports['Parse a lambda with capitalized variables'] = function (test) {
    var v = sl.parse('\\x.\\Ygrec.Zed');

    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), '\\x.\\Ygrec.Zed');
};


exports['Parse three variables'] = function (test) {
    var v = sl.parse('xyz');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xyz');
};

exports['Parse one and two variables'] = function (test) {
    var v = sl.parse('x(yz)');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'x(yz)');
};

exports['Parse two and one variables'] = function (test) {
    var v = sl.parse('(xy)z');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xyz');
};

exports['Parse three variables skipping spaces'] = function (test) {
    var v = sl.parse('x y z');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xyz');
};

exports['Throw exception when unclosed term'] = function (test) {
    test.throws(
        function() { sl.parse("(xy"); },
        "Unclosed term"
    );
};

exports['Throw exception when close parenthesis'] = function (test) {
    test.throws(
        function() { sl.parse("x)yz"); },
        "Unexpected ')'"
    );
};

exports['Parse simple lambda'] = function (test) {
    var v = sl.parse('\\x.x');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), '\\x.x');
};

exports['Parse simple lambda with ->'] = function (test) {
  var v = sl.parse('\\x->x');

  test.ok(v);
  test.equal(typeof v, 'object');
  test.equal(v.toString(), '\\x.x');
};

exports['Parse lambda enclosed in parenthesis'] = function (test) {
    var v = sl.parse('(\\x.x)');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), '\\x.x');
};

exports['Parse lambda enclosed in parenthesis and argument'] = function (test) {
    var v = sl.parse('(\\x.x)y');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), '(\\x.x)y');
};

exports['Throw exception when invalid argument'] = function (test) {
    test.throws(
        function() { sl.parse("\\."); },
        "Invalid argument name"
    );
};

//exports['Throw exception when missing point in lambda'] = function (test) {
//    test.throws(
//        function() { sl.parse("\\xy"); },
//        "Expected"
//    );
//};

exports['Parse a term, print it, parse again, print results in the same expression'] = function (test) {
  var v = sl.parse('((\\x.x)y(\\x.\\y.(\\z.zxy)))');

  test.ok(v);
  test.equal(typeof v, 'object');

  var newV = sl.parse(v.toString());

  test.equal(v.toString(), newV.toString());
};

exports['Parse lambdas without separator'] = function (test) {
  var v = sl.parse('\\y\\xxy');

  test.ok(v);
  test.equal(typeof v, 'object');
  test.equal(v.toString(), '\\y.\\x.xy');
};


exports['Parse nested lambda without separator'] = function (test) {
  var v = sl.parse('\\y(\\xx)y');

  test.ok(v);
  test.equal(typeof v, 'object');
  test.equal(v.toString(), '\\y.(\\x.x)y');
};

