const bench = require('fastbench');
const fs = require('fs');
const winston = require('winston');
const pino = require('pino');

const manifest = require('./package.json');
const packageLock = require('./package-lock.json');

const payload = packageLock;

const file = new winston.transports.File({ filename: '/dev/null' });
const wf = winston.createLogger({
  transports: [file],
});
const wf2 = winston.createLogger({
  transports: [file, file],
});

const stream = new winston.transports.Stream({
  stream: fs.createWriteStream('/dev/null'),
});

const ws = winston.createLogger({
  transports: [stream],
});
const ws2 = winston.createLogger({
  transports: [stream, stream],
});

const destination = pino.destination('/dev/null');
const pd = pino(destination);
const pd2 = pino(destination);
const pt = pino(
  pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: '/dev/null',
        },
      },
    ],
  }),
);
const pt2 = pino(
  pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: {
          destination: '/dev/null',
        },
      },
      {
        target: 'pino/file',
        options: {
          destination: '/dev/null',
        },
      },
    ],
  }),
);

const run = bench(
  [
    function winstonFile(done) {
      wf.info(payload);
      setImmediate(done);
    },
    function winstonTwoFiles(done) {
      wf2.info(payload);
      setImmediate(done);
    },
    function winstonStream(done) {
      ws.info(payload);
      setImmediate(done);
    },
    function winstonTwoStreams(done) {
      ws.info(payload);
      setImmediate(done);
    },

    function pinoDestination(done) {
      pd.info(payload);
      setImmediate(done);
    },
    function pinoTwoDestinations(done) {
      pd.info(payload);
      pd2.info(payload);
      setImmediate(done);
    },
    function pinoTransportOneTarget(done) {
      pt.info(payload);
      setImmediate(done);
    },
    function pinoTransportTwoTargets(done) {
      pt2.info(payload);
      setImmediate(done);
    },
  ],
  1000,
);

run();
