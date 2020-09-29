const acorn = require('acorn');
const astravel = require('astravel');
const astring = require('astring');
const { SourceMapGenerator } = require('source-map');
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

  // note: this does not work at all.
  const traveler = astravel.makeTraveler({
    go(node, state) {
      if (node.type === 'BinaryExpression') {
        switch (node.operator) {
          case '+': {
            if (node.left.type !== 'Literal' || node.right.type !== 'Literal') {
              node = buildASTObjectProto(callees.__add, [
                node.left,
                node.right,
              ]);
            }
            break;
          }
          case '==': {
            node = buildASTObjectProto(callees.__doubleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          case '!=': {
            node = buildASTObjectProto(callees.__notDoubleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          case '===': {
            node = buildASTObjectProto(callees.__tripleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          case '!==': {
            node = buildASTObjectProto(callees.__notTripleEqual, [
              node.left,
              node.right,
            ]);
            break;
          }
          default: {
            break;
          }
        }
      }
      this.super.go.call(this, node, state);
    },
  });

  traveler.go(ast, {});

  return ast;
};

const generate = (ast, content, filename) => {
  const map = new SourceMapGenerator({ file: filename });

  // note: doubles up comments.
  // note: source map seems useless.
  // note: doesn't generate transformed code.
  const code = astring.generate(ast, {
    comments: true,
    sourceMap: map,
  });

  return { code, map };
};

module.exports = function rewrite(content, filename) {
  let ast = parse(content, filename);
  ast = traverse(ast);
  return generate(ast, content, filename);
};
module.exports.parse = parse;
module.exports.traverse = traverse;
module.exports.generate = generate;
