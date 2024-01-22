// @ts-check

import { Bench } from 'tinybench';

const bench = new Bench({});

bench
  .add('A', () => {
    const str = 'A';
  })
  .add('B', () => {
    const str = 'B';
  })
  .todo('C', () => {
    const str = 'C';
  });

await bench.warmup();
await bench.run();

console.table(bench.table());
