# SimpleLambda

Lambda calculus implemented as interpreter in JavaScript.

## Installation

Via npm on Node:

```
npm install simplelambda
```


## Usage

Reference in your program:

```js
var sl = require('simplelambda');
```

Parse terms:

```js
term = sl.parse('x');       // variable
term = sl.parse('xy');      // sequence
term = sl.parse('\\x.xy');  // lambda
term = sl.parse('(\\x.x)(\\w.w)');
```

Reduce term:

```js
while (term) {
    console.log(term.toString());
    term = sl.reduce(term);     // returns null if no reduce can be applied
}
```

## Development

```
git clone git://github.com/ajlopez/SimpleLambda.git
cd SimpleLambda
npm install
npm test
```

## Samples

- [Simple Reduces](https://github.com/ajlopez/SimpleLambda/tree/master/samples/simple) Simple reduce examples.

## Versions

- 0.0.1: Published

- 0.0.2: Variables can be named by pattern [a-z][0-9]*. Parsing refactored. Alpha-conversion works correctly now.

- 0.0.3: Support HTML output. Syntax can accept \x->y as well as Unicode symbols (λx→y).

- 0.0.4: Option to keep bodies of lambda functions from reduction. More conservative (thus less confusing) alpha-conversions.

## License

MIT

## References

- [Lecture Notes on the Lambda Calculus](http://www.mscs.dal.ca/~selinger/papers/lambdanotes.pdf).
- [Notas sobre el Cálculo Lambda](http://ajlopez.zoomblog.com/archivo/2009/04/14/notas-sobre-el-Calculo-Lambda.html)

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleLambda) and submit
[pull requests](https://github.com/ajlopez/SimpleLambda/pulls) - contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

