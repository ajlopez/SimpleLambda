
const sl = require('..');

exports['Get fresh variable from variable'] = function (test) {
    test.equal(sl.parse('x').getFresh(), 'y');
    test.equal(sl.parse('y').getFresh(), 'z');
    test.equal(sl.parse('z').getFresh(), 'w');
    test.equal(sl.parse('w').getFresh(), 'v');
    test.equal(sl.parse('v').getFresh(), 'u');
    test.equal(sl.parse('u').getFresh(), 't');
    test.equal(sl.parse('t').getFresh(), 's');
    test.equal(sl.parse('a').getFresh(), 'b');
};

exports['Get fresh variable from apply'] = function (test) {
    test.equal(sl.parse('ab').getFresh(), 'c');
    test.equal(sl.parse('yx').getFresh(), 'z');
    test.equal(sl.parse('xy').getFresh(), 'z');
    test.equal(sl.parse('cba').getFresh(), 'd');
};

exports['Get fresh variable from lambda'] = function (test) {
    test.equal(sl.parse('\\x.x').getFresh(), 'y');
    test.equal(sl.parse('\\x.zy').getFresh(), 'w');
    test.equal(sl.parse('\\a.bcd').getFresh(), 'e');
};

