var freshCounter = 0;

/* Each term has methods toString, toHTML, substitute, hasFree, and getFreeVars.
* Only Apply and Lambda have the method 'reduce'. Only 'Lambda' has the method 'apply'.
* Variables must be lowercase.
* The global 'reduce' method now has an option, keepLambdaBody = true, which is false by default.
* If this option is set to true, the lambda function body will never be reduced until application.
* */

function isEqual(term1, term2) {
  if (isVariable(term1) && isVariable(term2) && term1.getName() == term2.getName()) {
    return true;
  }
  if (isApply(term1) && isApply(term2) && isEqual(term1.getLeft(), term2.getLeft()) && isEqual(term1.getRight(), term2.getRight())) {
    return true;
  }
  if (isLambda(term1) && isLambda(term2)) {
    if (term1.getBoundName() == term2.getBoundName() && isEqual(term1.getBody(), term2.getBody())) {
      return true;
    }
    else {
      var term2AlphaConverted = term2.substitute(term2.getBoundName(), new Variable(term1.getBoundName()));

      if (isEqual(term1.getBody(), term2AlphaConverted.getBody())) {
        return true;
      }
    }
  }
  return false;
}

function isVariable(term) {
  return Variable.prototype.isPrototypeOf(term);
}
function isLambda(term) {
  return Lambda.prototype.isPrototypeOf(term);
}
function isApply(term) {
  return Apply.prototype.isPrototypeOf(term);
}

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
  var shortVars = "xyzwvutsrabcdefghijklmnpq";

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

  this.getBoundName = function() {
    return name;
  };

  this.getBody = function() {
    return term;
  };

  var boundVar = new Variable(name);

  this.toString = function () {
    return "\\" + boundVar.toString() + "." + term.toString();
  };

  this.toHTML = function(boundVars) {
    if (typeof(boundVars)!=typeof([])) boundVars = [];
    return "λ" + boundVar.toHTML([name]) + "→" + term.toHTML([name].concat(boundVars));
  };

  // note: we have two different substitutions, one for the bound variable - and it can only
  // be substituted by another variable, which is alpha-conversion - and another when we
  // substitute a free variable by a new term, which is beta-conversion
  this.substitute = function (varname, newterm) {
    if (name === varname && !isVariable(newterm)) {
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

  this.reduce = function(options) {
    if ( (options && options.keepLambdaBody) || !term.reduce)
      return null;
    else {
      var newTerm = term.reduce();
      if (newTerm) return new Lambda(name, newTerm);
      else
        return null;
    }
  };

  this.hasFree = function (varname) {
    return name !== varname && term.hasFree(varname);
  };

  this.getFreeVars = function () {
    var termFreeVars = term.getFreeVars();
    var index = termFreeVars.indexOf(name); // our variable is not free in the term if it occurs there
    if (index != -1) termFreeVars.splice(index, 1);
    return termFreeVars;
  };
}

function Apply(left, right) {

  this.getLeft = function() {
    return left;
  };

  this.getRight = function() {
    return right;
  };

  this.toHTML = function (boundVars) {
    if (typeof(boundVars)!=typeof([])) boundVars = [];
    var leftstr = left.toHTML(boundVars);
    var rightstr = right.toHTML(boundVars);

    if (isApply(right) || isLambda(right))
      rightstr = "(" + rightstr + ")";

    if (isLambda(left))
      leftstr = "(" + leftstr + ")";

    return leftstr + "&nbsp;" + rightstr;
  };

  this.toString = function () {
    var leftstr = left.toString();
    var rightstr = right.toString();

    if (isApply(right) || isLambda(right))
      rightstr = "(" + rightstr + ")";

    if (isLambda(left))
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

    if (!isLambda(left))
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

function reduce(term, options) {
  if (term.reduce)
    return term.reduce(options);

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

    var name = text[p];
    if (name >= 'a' && name <= 'z') {
      p++;
      while (p < l && text[p] <= '9' && text[p] >= '0') {
        name += text[p];
        p++;
      }
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

    if (p < l && range.indexOf(text[p]) != -1) {
      p++;
      return true;
    } else {
      return false;
    }
  }

  // a term is an identifier or a lambda or ( term )
  function parseTerm() {
    if (skipWhitespaceAndCheckEnd()) return null;

    var varName = parseVarName();
    if (varName) return new Variable(varName);

    if (parseCharRange("\\λ")) {
      var name = parseVarName();

      if (!name)
        throw "Invalid argument name";

      if (parseCharRange(".→") || parseFixedString('->')) {
        var body = parseTerms();
        return new Lambda(name, body);
      } else {
        throw "Expected a lambda separator";
      }

    }

    if (parseCharRange("(")) {
      var term = parseTerms(); // true

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
  isLambda: isLambda,
  isApply: isApply,
  isVariable: isVariable,
  isEqual: isEqual,
  reduce: reduce,
  parse: parse
};

