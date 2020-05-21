const _generate = require('@babel/generator').default;
const { parse: _parse } = require('@babel/parser');
const template = require('@babel/template').default;
const _traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const _ = require('lodash');
const { callees, specs } = require('./callees');

const callBuilder = template(`%%callee%%(%%left%%, %%right%%)`);

const parse = (content, filename) => {
  return _parse(content, {
    range: true,
    sourceFilename: filename,
    sourceType: 'script',
    tokens: true,
  });
};

const traverse = (ast) => {
  return _traverse(
    ast,
    {
      BinaryExpression(path) {
        const { name } = _.find(specs, { token: path.node.operator }) || {};
        const callee = callees[name];

        if (
          !callee ||
          (path.node.operator === '+' &&
            t.isLiteral(path.node.left) &&
            t.isLiteral(path.node.right))
        )
          return;

        path.replaceWith(
          callBuilder({
            callee,
            left: path.node.left,
            right: path.node.right,
          }),
        );
      },
    },
    null,
    {},
  );
};

const generate = (ast, content, filename, opts = {}) => {
  return _generate(
    ast,
    {
      jsonCompatibleStrings: true,
      sourceFileName: filename,
      sourceMaps: true,
      ...opts,
    },
    content,
  );
};

module.exports = function rewrite(content, filename, opts = {}) {
  const ast = parse(content, filename, opts);
  traverse(ast);
  return generate(ast, content, filename);
};
module.exports.parse = parse;
module.exports.traverse = traverse;
module.exports.generate = generate;
