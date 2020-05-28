/* eslint-disable no-unused-vars */
const Benchmark = require('benchmark');
const crypto = require('crypto');
const fs = require('fs');

const suite = new Benchmark.Suite();

const content = fs.readFileSync('./sample.js').toString();

suite
  .add('md5 sum', () => {
    const cacheKey = crypto.createHash('md5').update(content).digest('hex');
  })
  .add('mtime', () => {
    const mtime = +fs.statSync('./sample.js').mtime;
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run({ async: true });
