
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
    
    this.substitute = function (varname, newterm) {        if (name === varname && !Variable.prototype.isPrototypeOf(newterm))            return this;    
        var body = term.substitute(varname, newterm);
        
        if (name !== varname)
            if (body === term)
                return this;
            else
                return new Lambda(name, body);
                
        return new Lambda(newterm.toString(), body);
    }        this.apply = function (newterm) {        return term.substitute(name, newterm);    }}

function Apply(left, right) {
    this.toString = function () {
        var leftstr = left.toString();
        var rightstr = right.toString();
        
        if (Apply.prototype.isPrototypeOf(right) || Lambda.prototype.isPrototypeOf(right))
            rightstr = "(" + rightstr + ")";
        if (Lambda.prototype.isPrototypeOf(left))            leftstr = "(" + leftstr + ")";            
        return leftstr + rightstr;
    }
    
    this.substitute = function (varname, newterm) {
        var newleft = left.substitute(varname, newterm);
        var newright = right.substitute(varname, newterm);
        
        if (newleft === left && newright === right)
            return this;
            
        return new Apply(newleft, newright);
    }        this.reduce = function () {
        var lreduce = reduce(left);
        
        if (lreduce)
            return new Apply(lreduce, right);
            
        var rreduce = reduce(right);
        
        if (rreduce)
            return new Apply(left, rreduce);
            
        if (!Lambda.prototype.isPrototypeOf(left))
            return null;
            
        return left.apply(right);
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
    if (term.reduce)
        return term.reduce();
        
    return null;
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
            
        var ch = text[p];
        if (ch == ')' && closed)            return null;                    p++;        
        if (isLetter(ch))
            return new Variable(ch);            
        if (ch == '\\') {
            var name = text[p++];
            
            if (!isLetter(name))
                throw "Invalid argument name";
            
            if (text[p++] != '.')
                throw "Expected '.'";
                
            var body = parseTerms(closed);
            
            return new Lambda(name, body);
        }
            
        if (ch == '(') {
            var term = parseTerms(true);
            
            if (text[p] != ')')
                throw "Unclosed term";                            p++;
            
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

