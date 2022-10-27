const bench = require('fastbench');

const run = bench(
  [
    function A(done) {
      const str = 'A';
      setImmediate(done);
    },
    function B(done) {
      const str = 'B';
      setImmediate(done);
    },
  ],
  10000,
);

run();
