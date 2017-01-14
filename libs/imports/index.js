var R = require('fc-tools/ramda');
var P = require('./_predicates');
var ST = require('./_string_transforms');
var PT = require('./_path_transforms');
var FO = require('./_file_object');
var Reducers = require('./_reducers');
var L = require('fc-tools/logging');

// []->[]
function formatFileObjects(fileObjects) {
  return fileObjects
  .map(ST.trimPath)
  .filter(P.removeEmptyPaths)
  .map(ST.pathToLowerCase)
  .map(FO.collectImportLines)
  .map(FO.removeLines)
  .map(L.labelInspect('collectImportLines'))
  .map(PT.importToImportFormat)
  .map(L.labelInspect('importToImportFormat'))
  .map(FO.removeEmptyLines)
  .map(PT.pathToImportFormat)
  .map(PT.indexPathToParentDirPath);
}

// [FileObject]->[Path]->[]
function getImports(fileObjects) {
  return formatFileObjects(fileObjects)
  .reduce(Reducers.collectImports, [])
  .reduce(Reducers.uniqImports, [])
  .map(R.toLower);
}

// [FileObject]->[Path]->[]
function getPaths(fileObjects) {
  return formatFileObjects(fileObjects)
  .reduce(Reducers.uniqPaths, [])
  .map(R.toLower);
}

// [FileObject]->[Path]->[]
function findDeadFiles(fileObjects) {
  return R.difference(getPaths(fileObjects), getImports(fileObjects));
}

module.exports = {
  getImports: getImports,
  getPaths: getPaths,
  findDeadFiles: findDeadFiles
};
