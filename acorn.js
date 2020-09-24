const acorn = require('acorn');
const astravel = require('astravel');
const astring = require('astring');
const { SourceMapGenerator } = require('source-map');
const estraverse = require('@contrast/estraverse');
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
  const comments = [];

  const ast = acorn.parse(content, {
    ecmaVersion: 2020,
    locations: true,
    ranges: true,
    onComment: comments,
    sourceFile: filename,
    sourceType: 'script',
  });

  ast.comments = comments;

  return ast;
};

const traverse = (ast) => {
  astravel.attachComments(ast, ast.comments);
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
  const map = new SourceMapGenerator({ file: filename });

  // currently doubling up comments.
  // source map is not working.
  const code = astring.generate(ast, {
    // comments: true,
    sourceMap: map,
  });

  return { code, map };
};

module.exports = function rewrite(content, filename) {
  const ast = parse(content, filename);
  traverse(ast);
  return generate(ast, content, filename);
};
module.exports.parse = parse;
module.exports.traverse = traverse;
module.exports.generate = generate;
