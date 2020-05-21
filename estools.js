const escodegen = require('@contrast/escodegen');
const estraverse = require('@contrast/estraverse');
const esprima = require('./esprima');
const { callees } = require('./callees');

function buildASTObjectProto(callee, args) {
  if (!callee) {
    return null;
  }

  return {
    type: 'CallExpression',
    callee,
    arguments: args,
  };
}

const parse = (content, filename) => {
  return esprima.parse(content, {
    loc: true,
    range: true,
    tokens: true,
    comment: true,
    sourceType: 'script',
  });
};

const traverse = (ast) => {
  estraverse.attachComments(ast, ast.comments, ast.tokens);
  return estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'BinaryExpression') {
        let rewrittenNode;
        switch (node.operator) {
          case '+': {
            if (node.left.type !== 'Literal' || node.right.type !== 'Literal') {
              rewrittenNode = buildASTObjectProto(callees.__add, [
                node.left,
                node.right,
              ]);
            }
            break;
          }
          case '==': {
            rewrittenNode = buildASTObjectProto(callees.__doubleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          case '!=': {
            rewrittenNode = buildASTObjectProto(callees.__notDoubleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          case '===': {
            rewrittenNode = buildASTObjectProto(callees.__tripleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          case '!==': {
            rewrittenNode = buildASTObjectProto(callees.__notTripleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          default: {
            rewrittenNode = node;
          }
        }

        return rewrittenNode;
      }

      return node;
    },
  });
};

const generate = (ast, content, filename) => {
  return escodegen.generate(ast, {
    sourceCode: content,
    format: {
      json: true,
      compact: false,
      preserveBlankLines: true,
    },
    comment: true,
  });
};

module.exports = function rewrite(content, filename) {
  const ast = parse(content, filename);
  traverse(ast);
  return generate(ast, content, filename);
};
module.exports.parse = parse;
module.exports.traverse = traverse;
module.exports.generate = generate;
