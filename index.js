const Benchmark = require('benchmark');
const path = require('path');

const suite = new Benchmark.Suite();

const dir = '/path/to/@contrast/agent';
const str = '/path/to/@contrast/agent/lib/file.js';

suite
  .add('.includes()', () => {
    return str.includes(dir);
  })
  .add('.startsWith()', () => {
    return str.startsWith(dir);
  })
  .add('.indexOf()', () => {
    return str.indexOf(dir) >= 0;
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run({ async: true });
