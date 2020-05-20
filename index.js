/* eslint-disable no-unused-vars */
const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const babel = require('./babel');
const babelTemplates = require('./babelTemplates');
const escodegen = require('./escodegen');

const suite = new Benchmark.Suite();

const filename = path.resolve(__dirname, './sample.js');
const content = fs.readFileSync(filename).toString();

suite
  .add('babel', () => {
    try {
      const result = babel(content, filename);
    } catch (err) {
      console.error(err);
      throw err;
    }
  })
  .add('babel w/ templates', () => {
    try {
      const result = babelTemplates(content, filename);
    } catch (err) {
      console.error(err);
      throw err;
    }
  })

  .add('escodegen', () => {
    try {
      const result = escodegen(content, filename);
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
