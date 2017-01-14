var FileObject = require('../common').FileObject;
var valToVal = require('../common').valToVal;
var readline = require('readline');
var fs = require('fs');
var Task = require('fc-tools/task');
var Either = require('fc-tools/either');
var _ = require('fc-tools/lodash');
var dirExists = require('../directories').dirExists;

// FileObject->Task(FileObject)
function addLines(fileObj) {
  return new Task(function(rej, res) {
    var filePath = _.get(fileObj, 'path', '');
    var lineReader = getLineReader(filePath);

    if(lineReader.on === undefined) return rej(fileObj);

    var result = FileObject(filePath);

    lineReader.on('line', function(line) {
      result.lines.push(line);
    });

    lineReader.on('close', function() {
      res(result);
    });
  });
}

//
function getLineReader(filePath) {
  return safeReadStream(filePath)
      .map(pathToLineReaderOptions)
      .fold(Either.Left, safeCreateInterface)
      .fold(emptyObject, valToVal);
}

// Path->{}
function pathToLineReaderOptions(stream) {
  return {
    input: stream
  };
}

var safeReadStream = Either.try(fs.createReadStream);

var fileExists = function(filePath) {
  return function() {
    return fs.existsSync(filePath) ? Either.of(true) : Either.Left(false);
  };
};

var safeCreateInterface = function(ops) {
  var filePath = _.get(ops, 'input.path');
  return dirExists(filePath)
  .fold(fileExists(filePath), Either.Left) // if file is not a dir check if it exists
  .fold(Either.Left, function() {
    return Either.of(readline.createInterface(ops));
  });
};

// _->{}
function emptyObject() {
  return {};
}

module.exports = {
  addLines: addLines
};
