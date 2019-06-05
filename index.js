const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

suite
  .add('A', () => {
    const str = 'B';
  })
  .add('B', () => {
    const str = 'B';
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name')}`);
  })
  .run({ async: true });
