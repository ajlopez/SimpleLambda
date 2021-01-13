const vars = "xyzwvutsrabcdefghijklmnopq";
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
    }        this.hasFree = function (varname) {        return name === varname;    }        this.getFresh = function () {        return freshVariable(name);    }
}

function isLetter(text) {
    if (!text)
        return false;
        
    if (text.length !== 1)
        return false;
        
    if (text < 'a' || text > 'z')
        return false;
        
    return true;
}function freshVariable(name) {    const p = vars.indexOf(name);        return vars[p + 1];}function freshVariables(v1, v2) {    const p1 = vars.indexOf(v1);    const p2 = vars.indexOf(v2);        if (p1 > p2)        return v1;        return v2;}

function Lambda(name, term) {
    this.toString = function () {
        return "\\" + name + "." + term.toString();
    };
    
    this.substitute = function (varname, newterm) {        if (name === varname && !(newterm instanceof Variable))            return this;                    if (name !== varname && newterm.hasFree(name)) {            const newname = freshVariables(term.getFresh(), newterm.getFresh());            const term2 = term.substitute(name, new Variable(newname)).substitute(varname, newterm);                        return new Lambda(newname, term2);        }    
        const body = term.substitute(varname, newterm);
        
        if (name !== varname)
            if (body === term)
                return this;
            else
                return new Lambda(name, body);
                
        return new Lambda(newterm.toString(), body);
    };        this.apply = function (newterm) {        return term.substitute(name, newterm);    };        this.hasFree = function (varname) {        if (name === varname)            return false;                    return term.hasFree(varname);    };        this.getFresh = function () {        return freshVariables(freshVariable(name), term.getFresh());    };}

function Apply(left, right) {
    this.toString = function () {
        let leftstr = left.toString();
        let rightstr = right.toString();
        
        if (right instanceof Apply || right instanceof Lambda)
            rightstr = "(" + rightstr + ")";
        if (left instanceof Lambda)            leftstr = "(" + leftstr + ")";            
        return leftstr + rightstr;
    }
    
    this.substitute = function (varname, newterm) {
        const newleft = left.substitute(varname, newterm);
        const newright = right.substitute(varname, newterm);
        
        if (newleft === left && newright === right)
            return this;
            
        return new Apply(newleft, newright);
    }        this.reduce = function () {        if (left instanceof Lambda)            return left.apply(right);        
        const lreduce = reduce(left);
        
        if (lreduce)
            return new Apply(lreduce, right);
            
        const rreduce = reduce(right);
        
        if (rreduce)
            return new Apply(left, rreduce);
            
        if (left instanceof Lambda)
            return left.apply(right);                return null;
            
    }
    this.hasFree = function (varname) {        return left.hasFree(varname) || right.hasFree(varname);    }
        this.getFresh = function () {        return freshVariables(left.getFresh(), right.getFresh());    };}

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
    const l = text.length;
    let p = 0;
    
    return parseTerms();
    
    function parseTerms(closed) {
        let term = null;
        
        for (let newterm = parseTerm(closed); newterm; newterm = parseTerm(closed))
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
            
        const ch = text[p];
        if (ch === ')' && closed)            return null;                    p++;        
        if (isLetter(ch))
            return new Variable(ch);            
        if (ch === '\\') {
            const name = text[p++];
            
            if (!isLetter(name))
                throw new Error("Invalid argument name");
            
            if (text[p++] != '.')
                throw new Error("Expected '.'");
                
            const body = parseTerms(closed);
            
            return new Lambda(name, body);
        }
            
        if (ch === '(') {
            const term = parseTerms(true);
            
            if (text[p] !== ')')
                throw new Error("Unclosed term");                            p++;
            
            return term;
        }
        
        throw new Error("Unexpected '" + ch + "'");
    }
}

module.exports = {
    createVariable: createVariable,
    createLambda: createLambda,
    createApply: createApply,
    reduce: reduce,
    parse: parse
};

