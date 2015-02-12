
var sl = require('..');

exports['Get free variables from variable'] = function (test) {
    test.equal(sl.parse('x').getFreeVars().toString(), ['x'].toString());
};

exports['Get free variables from apply'] = function (test) {
    test.equal(sl.parse('ab').getFreeVars().toString(), ['a','b'].toString());
    test.equal(sl.parse('cba').getFreeVars().toString(), ['c', 'b', 'a'].toString());
};

exports['Get free variables from lambda'] = function (test) {
    test.equal(sl.parse('\\x.x').getFreeVars().toString(), [].toString());
    test.equal(sl.parse('\\x.zy').getFreeVars().toString(), ['z', 'y'].toString());
    test.equal(sl.parse('\\a.ab').getFreeVars().toString(), ['b']);
};

