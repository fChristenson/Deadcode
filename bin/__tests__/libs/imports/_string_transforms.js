var R = require('fc-tools/ramda');
var path = require('path');
var _ = require('fc-tools/lodash');

// String->String
function removeQuotationMarks(str) {
  return str.replace(/['"]/g, '');
}

// String->String
function lineToPath(str) {
  return _.get(str.match(/.*(['"]\s*\.\.?\/.*\s*['"]).*/), '[1]', '');
}

// String->String
function removeIndexSubstring(str) {
  if(str && typeof str === 'string') {
    var array = str.split('/');
    return array.slice(0, array.length - 1).join('/');
  }

  return str;
}

// String->String
function filePathToParentDirectoryPath(str) {
  var array = str.split('/');
  return array.slice(0, array.length - 1).join('/');
}

// FileObject->FileObject
function pathToLowerCase(obj) {
  var str = _.get(obj, 'path', '');
  return Object.assign({}, obj, {path: str.toLowerCase()});
}

// FileObject->FileObject
function trimPath(obj) {
  var str = _.get(obj, 'path', '');
  return Object.assign({}, obj, {path: str.trim()});
}

// String->String
function removeFileExtension(str) {
  var data = path.parse(str);
  return path.join(data.dir, data.name);
}

module.exports = {
  removeQuotationMarks: removeQuotationMarks,
  lineToPath: lineToPath,
  removeIndexSubstring: removeIndexSubstring,
  filePathToParentDirectoryPath: filePathToParentDirectoryPath,
  pathToLowerCase: pathToLowerCase,
  trimPath: trimPath,
  removeFileExtension: removeFileExtension
};
