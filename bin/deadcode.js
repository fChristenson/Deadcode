#!/usr/bin/env node

var Imports = require('../libs/imports');
var D = require('../libs/directories');
var lib = require('../libs');
var Either = require('fc-tools/either');
require('colors');

Either
  .fromNullable(process.argv[2])
  .chain(D.dirExists)
  .fold(printError, function() {
    return lib(process.argv[2]);
  })
  .fork(console.error, function(list) {
    var fileObjects = list.toArray();

    printName();
    console.log('The following files are never imported.'.green);
    console.log('------------------------------------------------'.green);

    Imports.findDeadFiles(fileObjects)
    .forEach(function(file) {
      console.log(file.red);
    });
    console.log('------------------------------------------------'.green);
    console.log('');
  });

function printError(rootDir) {
  console.log(rootDir + ' is not a valid directory!');
}

function printName() {
  console.log('     _                 _                _       '.magenta);
  console.log('    | |               | |              | |      '.magenta);
  console.log('  __| |_____ _____  __| | ____ ___   __| |_____ '.magenta);
  console.log(' / _  | ___ (____ |/ _  |/ ___) _ \\ / _  | ___ |'.magenta);
  console.log('( (_| | ____/ ___ ( (_| ( (__| |_| ( (_| | ____|'.magenta);
  console.log(' \\____|_____)_____|\\____|\\____)___/ \\____|_____)'.magenta);
  console.log('');
}