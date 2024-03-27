// @ts-check

import { Bench } from 'tinybench';
import path from 'path';

const bench = new Bench({});

const filename = 'filename.js';

bench
  .add('.endsWith', () => {
    filename.endsWith('.mjs');
    filename.endsWith('.cjs');
  })
  .add('.match and check', () => {
    const ext = filename.match(/.[cm]js$/);
    ext?.[0] === '.mjs';
    ext?.[0] === '.cjs';
  })
  .add('.match x2', () => {
    filename.match(/.mjs$/);
    filename.match(/.cjs$/);
  })
  .add('path.extname', () => {
    const ext = path.extname(filename);
    ext === '.mjs';
    ext === '.cjs';
  });

await bench.warmup();
await bench.run();

console.table(bench.table());
