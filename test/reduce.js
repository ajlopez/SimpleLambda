
var sl = require('..');

exports['Reduce variable'] = function (test) {
    var term = sl.createVariable('x');    
    test.equal(sl.reduce(term), null);
}

exports['Reduce lambda'] = function (test) {
    var term = sl.createLambda('x', sl.createVariable('y'));
    test.equal(sl.reduce(term), null);
}

exports['Reduce simple apply'] = function (test) {
    var term = sl.createApply(sl.createVariable('x'), sl.createVariable('y'));
    test.equal(sl.reduce(term), null);
}
