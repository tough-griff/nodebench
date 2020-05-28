/* eslint-disable no-unused-vars */
const Benchmark = require('benchmark');
const fs = require('fs');
const v8 = require('v8');

const suite = new Benchmark.Suite();

const obj = {
  code: fs.readFileSync('./sample.js').toString(),
};

suite
  .add('JSON.stringify', () => {
    JSON.stringify(obj);
  })
  .add('v8.serialize', () => {
    v8.serialize(obj);
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run({ async: true });
