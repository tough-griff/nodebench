const fs = require('fs');
const path = require('path');
const acorn = require('./acorn');
const babel = require('./babel');
const estools = require('./estools');
const estoolsAcorn = require('./estools_acorn');
const estoolsAcornAstring = require('./estools_acorn_astring');

const filename = path.resolve(__dirname, './sample.js');
const content = fs.readFileSync(filename).toString();

const errHandler = (err) => {
  if (err) console.warn(err);
};

const acornRewriteResult = acorn(content, filename);
fs.writeFile(
  './results/acorn.result.js',
  acornRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/acorn.result.js.map',
  JSON.stringify(acornRewriteResult.map),
  'utf8',
  errHandler,
);

const babelRewriteResult = babel(content, filename);
fs.writeFile(
  './results/babel.result.js',
  babelRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/babel.result.js.map',
  JSON.stringify(babelRewriteResult.map),
  'utf8',
  errHandler,
);

const esToolsRewriteResult = estools(content, filename);
fs.writeFile(
  './results/estools.result.js',
  esToolsRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/estools.result.js.map',
  JSON.stringify(esToolsRewriteResult.map),
  'utf8',
  errHandler,
);

const estoolsAcornRewriteResult = estoolsAcorn(content, filename);
fs.writeFile(
  './results/estoolsAcorn.result.js',
  estoolsAcornRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/estoolsAcorn.result.js.map',
  JSON.stringify(estoolsAcornRewriteResult.map),
  'utf8',
  errHandler,
);

const estoolsAcornAstringRewriteResult = estoolsAcornAstring(content, filename);
fs.writeFile(
  './results/estoolsAcornAstring.result.js',
  estoolsAcornAstringRewriteResult.code,
  'utf8',
  errHandler,
);
fs.writeFile(
  './results/estoolsAcornAstring.result.js.map',
  JSON.stringify(estoolsAcornAstringRewriteResult.map),
  'utf8',
  errHandler,
);
