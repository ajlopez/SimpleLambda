
const sl = require('..');

exports['Parse variable'] = function (test) {
    const v = sl.parse('x');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'x');
};

exports['Parse variable skipping spaces'] = function (test) {
    const v = sl.parse('  x   ');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'x');
};

exports['Parse two variables'] = function (test) {
    const v = sl.parse('xy');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xy');
};

exports['Parse three variables'] = function (test) {
    const v = sl.parse('xyz');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xyz');
};

exports['Parse one and two variables'] = function (test) {
    const v = sl.parse('x(yz)');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'x(yz)');
};

exports['Parse two and one variables'] = function (test) {
    const v = sl.parse('(xy)z');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), 'xyz');
};

exports['Parse three variables skipping spaces'] = function (test) {
    const v = sl.parse('x y z');
    
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
    const v = sl.parse('\\x.x');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), '\\x.x');
};

exports['Parse lambda enclosed in parenthesis'] = function (test) {
    const v = sl.parse('(\\x.x)');
    
    test.ok(v);
    test.equal(typeof v, 'object');
    test.equal(v.toString(), '\\x.x');
};

exports['Parse lambda enclosed in parenthesis and argument'] = function (test) {
    const v = sl.parse('(\\x.x)y');
    
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

exports['Throw exception when missing point in lambda'] = function (test) {
    test.throws(
        function() { sl.parse("\\xy"); },
        "Expected '.'"
    );
};


