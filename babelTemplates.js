const generate = require('@babel/generator').default;
const { parse } = require('@babel/parser');
const template = require('@babel/template').default;
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const _ = require('lodash');
const { callees, specs } = require('./callees');

const callBuilder = template(`%%callee%%(%%left%%, %%right%%)`);

module.exports = function rewrite(content, filename) {
  const ast = parse(content, {
    range: true,
    sourceFilename: filename,
    sourceType: 'script',
    tokens: true,
  });

  traverse(
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

  return generate(
    ast,
    {
      jsonCompatibleStrings: true,
      sourceFileName: filename,
      sourceMaps: true,
    },
    content,
  );
};
