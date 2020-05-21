/* eslint-disable no-unused-vars */
const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const babel = require('./babel');
const estools = require('./estools');

const suite = new Benchmark.Suite();

const filename = path.resolve(__dirname, './sample.js');
const content = fs.readFileSync(filename).toString();

const babelAst = babel.parse(content, filename);
babel.traverse(babelAst);
const esAst = estools.parse(content, filename);
estools.traverse(esAst);

suite
  .add('babel', () => {
    try {
      const result = babel(content, filename);
    } catch (err) {
      console.error(err);
      throw err;
    }
  })
  .add('babel (no sourcemaps)', () => {
    try {
      const result = babel(content, filename, {
        sourceMaps: false,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  })
  .add('estools', () => {
    try {
      const result = estools(content, filename);
    } catch (err) {
      console.error(err);
      throw err;
    }
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run({ async: true });
