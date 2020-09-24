/* eslint-disable no-unused-vars */
const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const babel = require('./babel');
const estools = require('./estools');
const estoolsAcorn = require('./estools_acorn');

const suite = new Benchmark.Suite();

const filename = path.resolve(__dirname, './sample.js');
const content = fs.readFileSync(filename).toString();

const babelResult = babel(content, filename);
const estoolsResult = estools(content, filename);
const estoolsAcornResult = estoolsAcorn(content, filename);

fs.writeFileSync('./results/babelResult.js', babelResult.code);
fs.writeFileSync(
  './results/babelResult.js.map',
  JSON.stringify(babelResult.map),
);
fs.writeFileSync('./results/estoolsResult.js', estoolsResult.code);
fs.writeFileSync(
  './results/estoolsResult.js.map',
  JSON.stringify(estoolsResult.map),
);
fs.writeFileSync('./results/estoolsAcornResult.js', estoolsAcornResult.code);
fs.writeFileSync(
  './results/estoolsAcornResult.js.map',
  JSON.stringify(estoolsAcornResult.map),
);

suite
  .add('babel', () => {
    try {
      const result = babel(content, filename);
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
  .add('estools w/ acorn', () => {
    try {
      const result = estoolsAcorn(content, filename);
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
