var _ = require('fc-tools/lodash');

// []->FileObject->[]
function collectImports(acc, obj) {
  return acc.concat(_.get(obj, 'imports', []));
}

// []->FileObject->[]
function uniqImports(acc, str) {

  if(str !== '' && acc.indexOf(str) === -1) {
    return acc.concat([str]);
  }

  return acc;
}

// []->FileObject->[]
function uniqPaths(acc, obj) {
  var path = _.get(obj, 'path', '');

  if(path !== '' && acc.indexOf(path) === -1) {
    return acc.concat([path]);
  }

  return acc;
}

module.exports = {
  collectImports: collectImports,
  uniqImports: uniqImports,
  uniqPaths: uniqPaths
};
