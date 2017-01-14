var _ = require('fc-tools/lodash');
var R = require('fc-tools/ramda');
var P = require('./_predicates');
var ST = require('./_string_transforms');
var PT = require('./_path_transforms');
var Reducers = require('./_reducers');
var L = require('fc-tools/logging');

// {}->{}
function collectImportLines(obj){
  var imports = _.get(obj, 'lines', [])
  .filter(P.isCommonJsImport)
  .map(ST.lineToPath)
  .map(ST.removeQuotationMarks)
  .map(R.trim)
  .filter(P.isNotEmptyString);

  var requires = _.get(obj, 'lines', [])
  .filter(P.isCommonJsRequire)
  .map(ST.lineToPath)
  .map(ST.removeQuotationMarks)
  .map(R.trim)
  .filter(P.isNotEmptyString);

  return Object.assign({}, obj, {imports: imports.concat(requires)});
}

// FileObject->FileObject
function removeEmptyLines(obj) {
  var imports = _.get(obj, 'imports', [])
  .filter(P.isNotEmptyString);

  return Object.assign({}, obj, {imports: imports});
}

// FileObject->FileObject
function removeLines(obj) {
  return Object.assign({}, obj, {lines: []});
}

// []->[]
function formatFileObjects(fileObjects) {
  return fileObjects
  .map(ST.trimPath)
  .filter(P.removeEmptyPaths)
  .map(ST.pathToLowerCase)
  .map(collectImportLines)
  .map(removeLines)
  .map(L.labelInspect('collectImportLines'))
  .map(PT.importToImportFormat)
  .map(L.labelInspect('importToImportFormat'))
  .map(removeEmptyLines)
  .map(PT.pathToImportFormat)
  .map(PT.indexPathToParentDirPath);
}

// [FileObject]->[Path]->[]
function getImports(fileObjects) {
  var data = formatFileObjects(fileObjects);

  return data
  .reduce(Reducers.collectImports, [])
  .reduce(Reducers.uniqImports, [])
  .map(R.toLower);
}

// [FileObject]->[Path]->[]
function getPaths(fileObjects) {
  var data = formatFileObjects(fileObjects);

  return data
  .reduce(Reducers.uniqPaths, [])
  .map(R.toLower);
}

// [FileObject]->[Path]->[]
function findDeadFiles(fileObjects) {
  var data = formatFileObjects(fileObjects);

  var paths = data
  .reduce(Reducers.uniqPaths, [])
  .map(R.toLower);

  var imports = data
  .reduce(Reducers.collectImports, [])
  .reduce(Reducers.uniqImports, [])
  .map(R.toLower);

  console.log('diff', paths);
  console.log('--------------------------------------------');
  console.log('diff',imports);
  return _.difference(paths, imports);
}

module.exports = {
  getImports: getImports,
  getPaths: getPaths,
  findDeadFiles: findDeadFiles
};
