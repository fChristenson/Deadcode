var _ = require('fc-tools/lodash');
var R = require('fc-tools/ramda');
var P = require('./_predicates');
var ST = require('./_string_transforms');

// {}->{}
function collectImportLines(obj){
  var imports = _.get(obj, 'lines', [])
  .filter(P.isCommonJsLine)
  .map(ST.lineToPath)
  .map(ST.removeQuotationMarks)
  .map(R.trim)
  .filter(P.isNotEmptyString);

  return Object.assign({}, obj, {imports: imports});
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

module.exports = {
  collectImportLines: collectImportLines,
  removeEmptyLines: removeEmptyLines,
  removeLines: removeLines
};