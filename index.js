/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
// @ts-check
const Benchmark = require('benchmark');

Benchmark.options.minSamples = 100;

const suite = new Benchmark.Suite();

const STR_ARRAY = [
  '^(?!.*(newrelic)).*http.*$',
  '^(?!.*(something)).*http.*$'
];

const REGEX_ARRAY = [
  /^(?!.*(newrelic)).*http.*$/,
  /^(?!.*(something)).*http.*$/,
];

const COMPLEX_REGEX = /^(?!.*(newrelic|something)).*http.*$/;

const stack = [
  { file: 'newrelic http' },
  { file: 'something else http' },
  { file: 'foo http' },
];

suite
  .add('String array', () => {
    for (let stackIdx = 0; stackIdx < stack.length; stackIdx++) {
      const { file } = stack[stackIdx];
      for (let idx = 0; idx < STR_ARRAY.length; idx++) {
        if (file && !!file.match(new RegExp(STR_ARRAY[idx]))) {
          return true;
        }
      }
    }

    return false;
  })
  .add('Regex array (for of)', () => {
    for (const { file } of stack) {
      for (const trusted of REGEX_ARRAY) {
        if (trusted.exec(file)) {
          return true;
        }
      }
    }

    return false;
  })
  .add('Regex array (Array#some)', () =>
    stack.some(({ file }) =>
      REGEX_ARRAY.some((regex) =>
        regex.exec(file)
      )
    )
  )
  .add('Complex regex', () => {
    for (const { file } of stack) {
      if (COMPLEX_REGEX.exec(file)) {
        return true;
      }
    }

    return false;
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run({ async: true });
