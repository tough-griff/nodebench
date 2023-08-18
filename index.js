const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

const content = `\
#!/usr/bin/env node
'use strict';

const foo = require('foo');
// ensure we keep comments
const bar = foo + eval('"baz"');
module.exports.foobar = bar;
return;`;

const result = {
  code: `\
#!/usr/bin/env node
'use strict';

const foo = require('foo');
// ensure we keep comments
const bar = foo + eval('"baz"');
module.exports.foobar = bar;
return;
`,
};


suite
  .add('endsWith', () => {
    let carriageReturn = 0;
    // swc always adds a newline, so we only need to check the input
    if (!content.endsWith('\n')) {
      result.code = result.code.substring(0, result.code.length - 1);
    } else if (content.endsWith('\r\n')) {
      // if EOL is \r\n, then we need to account for that when we check the
      // negative index of the last semicolon below
      carriageReturn = 1;
    }
    const resultSemicolonIdx = result.code.lastIndexOf(';');
    const contentSemicolonIdx = content.lastIndexOf(';');
    if (contentSemicolonIdx === -1 || resultSemicolonIdx - result.code.length !== contentSemicolonIdx - content.length + carriageReturn) {
      result.code = result.code.substring(0, resultSemicolonIdx) + result.code.substring(resultSemicolonIdx + 1, result.code.length);
    }
  })
  .add('replace', () => {
    result.code = result.code.replace(/;\s*$/, content.match(/;?\s*$/)?.[0] ?? '');
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run({ async: true });
