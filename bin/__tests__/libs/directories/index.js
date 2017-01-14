var fs = require('fs');
var path = require('path');
var Either = require('fc-tools/either');
var Task = require('fc-tools/task');
var FileObject = require('../common').FileObject;
var emptyArray = require('../common').emptyArray;
var _ = require('fc-tools/lodash');

var safeReadDirSync = Either.try(fs.readdirSync);

// Path->Task
function walk(dir) {
  return Task.of(safeReadDirSync(dir)
  .fold(arrayToArray, arrayToArray)
  .reduce(fileNameToPath(dir), [])
  .map(dirToPaths)
  .filter(collectJsFiles)
  .filter(arrayIsNotEmpty)
  .reduce(concatPaths, [])
  .map(pathToFileObject));
}

function collectJsFiles(file) {
  return /\.jsx?$/.test(file);
}

// []->Bool
function arrayIsNotEmpty(array) {
  return array.length > 0;
}

// Path->{}
function pathToFileObject(path) {
  return FileObject(path);
}

// []->a->[]
function concatPaths(acc, val) {
  return Array.isArray(val) ? acc.concat(val) : acc.concat([val]);
}

// a->[]
function arrayToArray(array) {
  return Array.isArray(array) ? array : [];
}

// Path->[]->FileName->[]
var fileNameToPath = _.curry(function(dir, acc, file) {
  return acc.concat([path.join(dir, file)]);
});

// Path->[]
function dirToPaths(path) {
  return safeStatSync(path)
  .fold(arrayToArray, function(stats) {
    return stats.isDirectory()
    ? walk(path).fork(emptyArray, fileObjectsToFilePaths)
    : [path];
  });
}

// []->[]
function fileObjectsToFilePaths(fileObjects) {
  return fileObjects.map(function(obj) {
    return _.get(obj, 'path');
  });
}

var safeStatSync = Either.try(fs.statSync);

// Path->Either
function dirExists(dir) {
  return safeStatSync(dir)
  .fold(function() {
    return Either.Left(false);
  }, isDir);
}

// Stats->Either
function isDir(stats) {
  return stats.isDirectory() 
  ? Either.Right(true) 
  : Either.Left(false);
}

module.exports = {
  walk: walk,
  safeStatSync: safeStatSync,
  isDir: isDir,
  dirExists: dirExists
};