
function Variable(name) {
    this.toString = function () {
        return name;
    }
    
    this.substitute = function (varname, newterm) {
        if (name === varname)
            return newterm;
            
        return this;
    }
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
    this.toString = function () {        var leftstr = left.toString();        var rightstr = right.toString();                if (Apply.prototype.isPrototypeOf(right))            rightstr = "(" + rightstr + ")";                    return leftstr + rightstr;
    }        this.substitute = function (varname, newterm) {        var newleft = left.substitute(varname, newterm);        var newright = right.substitute(varname, newterm);                if (newleft === left && newright === right)            return this;                    return new Apply(newleft, newright);    }}

function createApply(left, right) {
    return new Apply(left, right);
}

function createVariable(name) {
    return new Variable(name);
}

function createLambda(name, term) {
    return new Lambda(name, term);
}

module.exports = {
    createVariable: createVariable,
    createLambda: createLambda,
    createApply: createApply
};

