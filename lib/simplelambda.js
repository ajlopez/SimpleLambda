
function Variable(name) {
    if (!isLetter(name))
        throw "invalid variable name";
        
    this.toString = function () {
        return name;
    }
    
    this.substitute = function (varname, newterm) {
        if (name === varname)
            return newterm;
            
        return this;
    }
}

function isLetter(text) {
    if (!text)
        return false;
        
    if (text.length != 1)
        return false;
        
    if (text < 'a' || text > 'z')
        return false;
        
    return true;
}

function Lambda(name, term) {
    this.toString = function () {
        return "\\" + name + "." + term.toString();
    }
    
    this.substitute = function (varname, newterm) {
        var body = term.substitute(varname, newterm);
        
        if (name !== varname)
            if (body === term)
                return this;
            else
                return new Lambda(name, body);
                
        return new Lambda(newterm.toString(), body);
    }
}

function Apply(left, right) {
    this.toString = function () {
        var leftstr = left.toString();
        var rightstr = right.toString();
        
        if (Apply.prototype.isPrototypeOf(right))
            rightstr = "(" + rightstr + ")";
            
        return leftstr + rightstr;
    }
    
    this.substitute = function (varname, newterm) {
        var newleft = left.substitute(varname, newterm);
        var newright = right.substitute(varname, newterm);
        
        if (newleft === left && newright === right)
            return this;
            
        return new Apply(newleft, newright);
    }
}

function createApply(left, right) {
    return new Apply(left, right);
}

function createVariable(name) {
    return new Variable(name);
}

function createLambda(name, term) {
    return new Lambda(name, term);
}

function reduce(term) {
    return term;
}

function parse(text) {
    var term = null;
    var l = text.length;
    var p = 0;
    
    return parseTerms();
    
    function parseTerms(closed) {
        var term = null;
        
        for (var newterm = parseTerm(closed); newterm; newterm = parseTerm(closed))
            if (term)
                term = new Apply(term, newterm);
            else
                term = newterm;
                
        return term;
    }
    
    function parseTerm(closed) {
        while (p < l && text[p] <= ' ')
            p++;
            
        if (p >= l)
            return null;
            
        var ch = text[p++];
        
        if (isLetter(ch))
            return new Variable(ch);
            
        if (ch == ')' && closed)
            return null;
            
        if (ch == '(') {
            var term = parseTerms(true);
            
            if (text[p - 1] != ')')
                throw "Unclosed term";
            
            return term;
        }
        
        throw "Unexpected '" + ch + "'";
    }
}

module.exports = {
    createVariable: createVariable,
    createLambda: createLambda,
    createApply: createApply,
    reduce: reduce,
    parse: parse
};

