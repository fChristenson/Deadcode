var List = require('fc-tools/immutable').List;
var Lines = require('./lines');
var Task = require('fc-tools/task');
var valToVal = require('./common').valToVal;
var emptyArray = require('./common').emptyArray;
var Directories = require('./directories');

module.exports = function(dir) {
  var fileObjects = Directories.walk(dir)
  .fork(emptyArray, valToVal);

  return List(fileObjects)
  .traverse(Task.of, Lines.addLines);
};
