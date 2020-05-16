/* eslint-disable no-unused-vars */
const template = require('@babel/template').default;
const t = require('@babel/types');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();

suite
  .add('@babel/types factory', () => {
    const req = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier('state.methodsId'),
        t.callExpression(t.identifier('require'), [
          t.stringLiteral(`module/lib/methods`),
        ]),
      ),
    ]);
  })
  .add('@babel/template', () => {
    const buildRequire = template(`
      const %%methodsId%% = require(%%methods%%);
    `);

    const req = buildRequire({
      methodsId: t.identifier('state.methodsId'),
      methods: t.stringLiteral(`module/lib/methods`),
    });
  })
  .on('cycle', function onCycle(event) {
    console.log(event.target.toString());
  })
  .on('complete', function onComplete() {
    console.log(`Fastest is ${this.filter('fastest').map('name').join(', ')}`);
  })
  .run();
