var P = require('./_predicates');
var ST = require('./_string_transforms');
var _ = require('fc-tools/lodash');
var Maybe = require('fc-tools/maybe');
var T = require('fc-tools/transform');

// FileObject->FileObject
function pathToImportFormat(obj) {
  var array = _.get(obj, 'path', '').split('.');
  return Object.assign({}, obj, {path: _.get(array, '[0]', '')});
}

function stripPathLevels(pathArray, strArray) {
  if(pathArray.length > strArray.length) {
    var result = pathArray
      .slice(0, pathArray.length - (strArray.length + 1))
      .join('/');

    return Maybe.Just(result);
  }

  return Maybe.Nothing();
}

// Path->String->Path
var resolveRelativeIndexImport = _.curry(function(path, str) {
  var pathArray = path.split('/').filter(P.isNotEmptyString);
  var strArray = str.split('/').filter(P.isNotEmptyString);

  return stripPathLevels(pathArray, strArray)
  .getOrElse(T.valToEmptyString);
});

// FileObject->String->Maybe(FileObject)
function tryRemoveIndexSubstring(obj, str) {
  if(P.isIndexPath(str)) {
    return Maybe.Just(Object.assign({}, obj, {path: ST.removeIndexSubstring(str)}));
  }

  return Maybe.Nothing();
}

// FileObject->FileObject
function indexPathToParentDirPath(obj) {
  var str = _.get(obj, 'path', '');
  return tryRemoveIndexSubstring(obj, str)
  .getOrElse(T.valToDefault(obj));
}

// Path->String->Path
function setPathFile(filePath, file) {
  var array = filePath.split('/').filter(P.isNotEmptyString);
  var array2 = file.split('/').filter(P.isNotEmptyString);
  var filename = array2[array2.length - 1];
  array[array.length - 1] = filename;

  return array.join('/');
}

// AbsolutePath->RelativePath
function concatPaths(absolutePath, relativePath) {
  var absArray = absolutePath.split('/').filter(P.isNotEmptyString);
  var relativeArray = relativePath.split('/').filter(P.isNotEmptyString);
  relativeArray = relativeArray.filter(P.isNotDoubleDot);
  var numLevelsToGoUp = relativeArray.filter(P.isDoubleDot).length;

  return absArray.slice(0, (absArray.length - (numLevelsToGoUp + 1)))
  .concat(relativeArray)
  .join('/');
}

// FilePath->RelativePath->AbsolutePath
var relativePathToAbsolutePath = _.curry(function(filePath, str) {
  if(P.isSameDirectoryRelativePath(str)) {
    return setPathFile(filePath, str);
  }

  if(P.isRelativeIndexImport(str)) {
    return ST.filePathToParentDirectoryPath(filePath);
  }

  return concatPaths(filePath, str);
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
