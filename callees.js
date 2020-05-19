const t = require('@babel/types');
const _ = require('lodash');

/**
 * @param {string} method
 * @returns {babel.types.MemberExpression}
 */
const createCallee = (method) =>
  t.memberExpression(t.identifier('ContrastMethods'), t.identifier(method));

module.exports.specs = [
  // XXX we may want individual injected globals to be their own items in the specs
  { name: 'wrap', token: '', modes: { Assess: 1, Protect: 0 } },
  // XXX because this is behind a config flag, it is probably less performant to
  // do this check than it is not to. it won't save us anything substantial.
  // { name: 'catch', token: 'catch', modes: { Assess: 1, Protect: 1 } },

  { name: '__add', token: '+', modes: { Assess: 1, Protect: 0 } },
  { name: '__forceCopy', token: '', modes: { Assess: 1, Protect: 0 } },
  { name: '__contrastEval', token: 'eval', modes: { Assess: 1, Protect: 1 } },
  { name: '__contrastTag', token: '${', modes: { Assess: 1, Protect: 0 } },
  { name: '__tripleEqual', token: '===', modes: { Assess: 1, Protect: 0 } },
  { name: '__notTripleEqual', token: '!==', modes: { Assess: 1, Protect: 0 } },
  { name: '__doubleEqual', token: '==', modes: { Assess: 1, Protect: 0 } },
  { name: '__notDoubleEqual', token: '!=', modes: { Assess: 1, Protect: 0 } },
  { name: '__cast', token: 'switch', modes: { Assess: 1, Protect: 0 } },
  { name: 'staticVisitors', token: '', modes: { Assess: 1, Protect: 0 } },
];

/**
 * Optimization - pre-build all the callees; there's no reason to build these
 * while we traverse. Depending on agent mode settings, some will not get built.
 * @type {{ [name: string]: import('@babel/types').MemberExpression}}
 */
module.exports.callees = module.exports.specs.reduce(
  (memo, callee) =>
    (callee.modes.Assess && true) || (callee.modes.Protect && false)
      ? _.set(memo, callee.name, createCallee(callee.name))
      : memo,
  {},
);
