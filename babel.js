const generate = require('@babel/generator').default;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const _ = require('lodash');
const { callees, specs } = require('./callees');

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
          t.callExpression(callee, [path.node.left, path.node.right]),
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
