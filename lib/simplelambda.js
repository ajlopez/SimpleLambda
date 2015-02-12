var freshCounter = 0;

/* Each term has methods toString, toHTML, substitute, hasFree, and getFreeVars.
* Only Apply has the method 'reduce'.
* Variables must be lowercase.
* */

function Variable(name) {
  if (!isIdentifier(name))
    throw "invalid variable name";

  this.toHTML = function(boundVars){
    if (typeof(boundVars)!=typeof([])) boundVars = [];
    var isFree = boundVars.indexOf(name) == -1;
    var htmlName = name;
    var subscript = '';
    if (name.match(/^[a-z][0-9]+$/)) {
      subscript = '<sub>' + name.substr(1) + '</sub>';
      htmlName = name.substr(0,1);
    }
    return "<i>" + (isFree ? "<b>" + htmlName + "</b>" : htmlName) + "</i>" + subscript;
  };

  this.toString = function () {
    return name;
  };

  this.substitute = function (varname, newterm) {
    if (name === varname)
      return newterm;
    else
     return this;
  };

  this.hasFree = function (varname) {
    return name === varname;
  };

  this.getFreeVars = function () {
    return [name];
  };

  this.getName = function() {
    return name;
  }

}

function isIdentifier(text) {
  return (text && typeof(text) == typeof("") && text.length > 0 && text.match(/^[a-z][0-9]*$/) );
}

function makeFreshName(boundVars) {
  var minIndex = 0;
  var shortVars = "xyzwvutsrabcdefghijklmnopq";

  if (boundVars) {
    boundVars.forEach(function(bVar){
      if (bVar.match(/^[a-z]$/)) {
        shortVars = shortVars.replace(bVar, '');
      }
      else if (bVar.match(/^v[0-9]+$/)) {
        var n = parseInt(bVar.substr(1));
        if (n>=minIndex) minIndex = n+1;
      }
    });
    var newName = (shortVars.length > 0) ? shortVars.charAt(0) : "v" + minIndex;
//    console.log('makeFreshName', boundVars, 'returns', newName);
    return newName;
  }

  return shortVars.charAt(0);
}

function Lambda(name, term) {

  var boundVar = new Variable(name);

  this.toString = function () {
    return "\\" + boundVar.toString() + "." + term.toString();
  };

  this.toHTML = function(boundVars) {
    if (typeof(boundVars)!=typeof([])) boundVars = [];
    return "λ" + boundVar.toHTML([name]) + "→" + term.toHTML([name].concat(boundVars));
  };

  // note: we have two different substitutions, one for the bound variable - and it can only be substituted by another variable, which is alpha-conversion - and another when we substitute a free variable by a new term, which is beta-conversion
  this.substitute = function (varname, newterm) {
    if (name === varname && !Variable.prototype.isPrototypeOf(newterm)) {
      console.log('invalid usage: cannot substitute x by a non-variable in \\x->...; ignored.');
      return this;
    }

    if (name !== varname && newterm.hasFree(name)) { // need alpha-conversion
      var newname = makeFreshName(term.getFreeVars().concat(newterm.getFreeVars())); // guarantee that newname is not free in our term and in newterm
      var term2 = term.substitute(name, new Variable(newname)).substitute(varname, newterm);
      return new Lambda(newname, term2);
    }

    var body = term.substitute(varname, newterm);

    if (name !== varname)
      if (body === term)
        return this;
      else
        return new Lambda(name, body);

    else {
      // if we are here, newterm is a variable, and we are simply alpha-renaming ourselves
      return new Lambda(newterm.getName(), body);
    }
  };

  this.apply = function (newterm) {
    return term.substitute(name, newterm);
  };

  this.hasFree = function (varname) {
    return name !== varname && term.hasFree(varname);
  };

  this.getFreeVars = function () {
    var termFreeVars = term.getFreeVars();
    var index = termFreeVars.indexOf(name); // our variable is not free in the term if it occurs there
    if (index != -1) termFreeVars.splice(index, 1);
//    console.log('termFreeVars', termFreeVars, 'index', index, 'splicing', termFreeVars.splice(index, 1));
    return termFreeVars;
  };
}

function Apply(left, right) {
  this.toHTML = function (boundVars) {
    if (typeof(boundVars)!=typeof([])) boundVars = [];
    var leftstr = left.toHTML(boundVars);
    var rightstr = right.toHTML(boundVars);

    if (Apply.prototype.isPrototypeOf(right) || Lambda.prototype.isPrototypeOf(right))
      rightstr = "(" + rightstr + ")";

    if (Lambda.prototype.isPrototypeOf(left))
      leftstr = "&nbsp;(" + leftstr + ")&nbsp;";

    return leftstr + rightstr;
  };

  this.toString = function () {
    var leftstr = left.toString();
    var rightstr = right.toString();

    if (Apply.prototype.isPrototypeOf(right) || Lambda.prototype.isPrototypeOf(right))
      rightstr = "(" + rightstr + ")";

    if (Lambda.prototype.isPrototypeOf(left))
      leftstr = "(" + leftstr + ")";

    return leftstr + rightstr;
  };

  this.substitute = function (varname, newterm) {
    var newleft = left.substitute(varname, newterm);
    var newright = right.substitute(varname, newterm);

    if (newleft === left && newright === right)
      return this;

    return new Apply(newleft, newright);
  };

  this.reduce = function () {
    var lreduce = reduce(left);

    if (lreduce)
      return new Apply(lreduce, right);

    var rreduce = reduce(right);

    if (rreduce)
      return new Apply(left, rreduce);

    if (!Lambda.prototype.isPrototypeOf(left))
      return null;

    return left.apply(right);
  };

  this.hasFree = function (varname) {
    return left.hasFree(varname) || right.hasFree(varname);
  };

  this.getFreeVars = function () {
    return left.getFreeVars().concat(right.getFreeVars());
  };
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
  var l = text.length;
  var p = 0;

  var result = parseTerms();
  if (p != l) {
    throw "Unexpected '" + text[p] + "'";
  } else {
    return result;
  }

  function parseTerms() {
    var term = null;

    for (var newterm = parseTerm(); newterm; newterm = parseTerm())
      if (term)
        term = new Apply(term, newterm);
      else
        term = newterm;

    return term;
  }

  function parseVarName() { // [a-z][0-9]*
//    console.log('parseVarName at', p, 'input string:', text);

    var name = text[p];
    if (name >= 'a' && name <= 'z') {
      p++;
      while (p < l && text[p] <= '9' && text[p] >= '0') {
        name += text[p];
        p++;
      }
//      console.log('returns', name);
      return name;

    } else {
      return null;
    }
  }

  function skipWhitespaceAndCheckEnd() {
    while (p < l && text[p] <= ' ')
      p++;
    return p>=l;
  }

  function parseFixedString(str) {
    if (str && str.length > 0 && p + str.length < l && text.substr(p, str.length) == str) {
      p += str.length;
      return true;
    } else {
      return false;
    }
  }

  function parseCharRange(range) {
//    console.log('parseCharRange at', p, 'input string:', text);

    if (p < l && range.indexOf(text[p]) != -1) {
      p++;
      return true;
    } else {
      return false;
    }
  }

  // a term is an identifier or a lambda or ( term )
  function parseTerm() {
//    console.log('parseTerm at', p, 'input string:', text);
    if (skipWhitespaceAndCheckEnd()) return null;

    var varName = parseVarName();
    if (varName) return new Variable(varName);

    if (parseCharRange("\\λ")) {
      var name = parseVarName();

      if (!name)
        throw "Invalid argument name";

      if (!parseCharRange(".→") && !parseFixedString('->'))
        throw "Expected a lambda separator";

      var body = parseTerms();

      return new Lambda(name, body);
    }

    if (parseCharRange("(")) {
      var term = parseTerms(); // true
//      console.log('parsing', text, 'position', p, 'term', term.toString());

      if (parseCharRange(")")) {
        return term;
      } else {
        throw "Unclosed term at position " + p + ", input string: " + text;
      }
    }

    return null;
  }
}

module.exports = {
  createVariable: createVariable,
  createLambda: createLambda,
  createApply: createApply,
  reduce: reduce,
  parse: parse
};

