/* eslint-disable no-unused-vars */
const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const acorn = require('./acorn');
const babel = require('./babel');
const estools = require('./estools');
const estoolsAcorn = require('./estools_acorn');

const suite = new Benchmark.Suite();

const filename = path.resolve(__dirname, './sample.js');
const content = fs.readFileSync(filename).toString();

const errHandler = (err) => {
  if (err) console.warn(err);
};

const acornRewriteResult = acorn(content, filename);
fs.writeFile(
  './results/acorn.result.js',
  acornRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/acorn.result.js.map',
  JSON.stringify(acornRewriteResult.map),
  'utf8',
  errHandler,
);

const babelRewriteResult = babel(content, filename);
fs.writeFile(
  './results/babel.result.js',
  babelRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/babel.result.js.map',
  JSON.stringify(babelRewriteResult.map),
  'utf8',
  errHandler,
);

const esToolsRewriteResult = estools(content, filename);
fs.writeFile(
  './results/estools.result.js',
  esToolsRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/estools.result.js.map',
  JSON.stringify(esToolsRewriteResult.map),
  'utf8',
  errHandler,
);

const estoolsAcornRewriteResult = estoolsAcorn(content, filename);
fs.writeFile(
  './results/estoolsAcorn.result.js',
  estoolsAcornRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/estoolsAcorn.result.js.map',
  JSON.stringify(estoolsAcornRewriteResult.map),
  'utf8',
  errHandler,
);

suite
  .add('acorn', () => {
    try {
      const result = acorn(content, filename);
    } catch (err) {
      console.error(err);
      throw err;
    }
  })

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
