/* eslint-disable no-unused-vars */
const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const acorn = require('./acorn');
const babel = require('./babel');
const estools = require('./estools');
const estoolsAcorn = require('./estools_acorn');
const estoolsAcornAstring = require('./estools_acorn_astring');

const suite = new Benchmark.Suite();

const filename = path.resolve(__dirname, './sample.js');
const content = fs.readFileSync(filename).toString();

require('./test');

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
  .add('estools w/ acorn & astring', () => {
    try {
      const result = estoolsAcornAstring(content, filename);
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
