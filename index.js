/* eslint-disable prettier/prettier */
// @ts-check
const Benchmark = require('benchmark');

Benchmark.options.minSamples = 100;

const suite = new Benchmark.Suite();

suite
  .add('A', () => {
    const str = 'A';
  })
  .add('B', () => {
    const str = 'B';
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run({ async: true });
