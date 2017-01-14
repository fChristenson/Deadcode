var path = require('path');
var P = require('./_predicates');
var ST = require('./_string_transforms');
var _ = require('fc-tools/lodash');

// FileObject->FileObject
function pathToImportFormat(obj) {
  var array = _.get(obj, 'path', '').split('.');
  return Object.assign({}, obj, {path: _.get(array, '[0]', '')});
}

// Path->String->Path
var resolveRelativeIndexImport = _.curry(function(path, str) {
  var pathArray = path.split('/').filter(P.isNotEmptyString);
  var strArray = str.split('/').filter(P.isNotEmptyString);

  if(pathArray.length > strArray.length) {
    return pathArray
      .slice(0, pathArray.length - (strArray.length + 1))
      .join('/');
  }

  return '';
});

// FileObject->FileObject
function indexPathToParentDirPath(obj) {
  var str = _.get(obj, 'path', '');
  if(P.isIndexPath(str)) {
    return Object.assign({}, obj, {path: ST.removeIndexSubstring(str)});
  }

  return obj;
}

// FilePath->RelativePath->AbsolutePath
var relativePathToAbsolutePath = _.curry(function(filePath, str) {
  if(P.isSameDirectoryRelativePath(str)) {
    // resolves expects "../"" in order to switch the filepath's
    // file and use the str path so we add "." to "./"
    return path.normalize(filePath, '.' + str);  
  }
  if(P.isRelativeIndexImport(str)) {
    return ST.filePathToParentDirectoryPath(filePath);
  }

  console.log('resolve', filePath, str, path.normalize(filePath, str));
  return path.normalize(filePath, str);
});

// String->String->String
var formatImport = _.curry(function(filePath, str) {
  if(P.hasFileExtension(str)) {
    return ST.removeFileExtension(relativePathToAbsolutePath(filePath, str));
  }

  if(P.isRelativeIndexImport(str)) {
    return resolveRelativeIndexImport(filePath, str);
  }

  if(P.isSameDirectoryRelativePath(str)) {
    return relativePathToAbsolutePath(filePath, str);
  }

  return relativePathToAbsolutePath(ST.filePathToParentDirectoryPath(filePath), str);
});

// FileObject->FileObject
function importToImportFormat(obj) {
  var filePath = _.get(obj, 'path', '');
  var imports = _.get(obj, 'imports', [])
  .map(formatImport(filePath));

  return Object.assign({}, obj, {imports: imports});
}

module.exports = {
  pathToImportFormat: pathToImportFormat,
  indexPathToParentDirPath: indexPathToParentDirPath,
  importToImportFormat: importToImportFormat
};
