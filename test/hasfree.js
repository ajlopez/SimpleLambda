var sl = require('..');

exports['Variable has itself as free'] = function (test) {
    test.ok(sl.parse('x').hasFree('x'));
}

exports['Variable has other variable as not free'] = function (test) {
    test.equal(sl.parse('x').hasFree('y'), false);
}

exports['Apply has first variable as free'] = function (test) {
    test.ok(sl.parse('xy').hasFree('x'));
}

exports['Apply has second variable as free'] = function (test) {
    test.ok(sl.parse('xy').hasFree('y'));
}

exports['Apply has not found variable as not free'] = function (test) {
    test.equal(sl.parse('xy').hasFree('z'), false);
}

exports['Lambda has argument as not free'] = function (test) {
    test.equal(sl.parse('\\x.y').hasFree('x'), false);
}

exports['Lambda has not bound variable as free'] = function (test) {
    test.ok(sl.parse('\\x.y').hasFree('y'));
}

exports['Lambda has not found variable as not free'] = function (test) {
    test.equal(sl.parse('\\x.y').hasFree('z'), false);
}

