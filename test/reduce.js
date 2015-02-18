
var sl = require('..');

exports['Reduce variable'] = function (test) {
    var term = sl.parse('x');    
    test.equal(sl.reduce(term), null);
};

exports['Reduce lambda'] = function (test) {
    var term = sl.parse('\\x.x');
    test.equal(sl.reduce(term), null);
};

exports['Reduce simple apply'] = function (test) {
    var term = sl.parse('xy');
    test.equal(sl.reduce(term), null);
};

exports['Reduce apply with left lambda'] = function (test) {
    var term = sl.reduce(sl.parse('(\\x.x)y'));
    test.ok(term);
    test.equal(term.toString(), 'y');
};

exports['Reduce complex term'] = function (test) {
    var term = sl.reduce(sl.parse('(\\x.y)((\\z.zz)(\\w.w))'));
    test.ok(term);
    test.equal(term.toString(), '(\\x.y)((\\w.w)(\\w.w))');
    term = sl.reduce(term);
    test.ok(term);
    test.equal(term.toString(), '(\\x.y)(\\w.w)');
    term = sl.reduce(term);
    test.ok(term);
    test.equal(term.toString(), 'y');
};

exports['Reduce the body of lambda'] = function (test) {
    var term = sl.reduce(sl.parse('\\x.(\\z.z)y'));
    test.ok(term);
    test.equal(term.toString(), '\\x.y');
};
exports['Do not reduce the body of lambda if given keepLambdaBody=true'] = function (test) {
    var term = sl.reduce(sl.parse('\\x.(\\z.z)y'), { keepLambdaBody: true });
    test.equal(term, null);
};
