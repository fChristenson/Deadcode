var Lines = require('../');
var path = require('path');
var FileObject = require('../../common').FileObject;
var fail = require('../../common/common_test_utils').fail;
var expect = require('chai').expect;

describe('lines', function() {
  it('has a module', function() {
    expect(Lines).to.be.ok;
  });

  var TESTING_DIR_FILE = path.join(__dirname, 'testing_dir', 'foo.js');
  var TESTING_DIR_FILE2 = path.join(__dirname, 'testing_dir', 'bar.js');

  describe('addLines', function() {
    it('adds a files lines to a file object', function(done) {
      Lines.addLines(FileObject(TESTING_DIR_FILE))
      .fork(fail('addLines failed'), function(fileObj) {
        expect(fileObj.lines.length).to.equal(2);
        done();
      });
    });

    it('adds nothing if files has no lines', function(done) {
      Lines.addLines(FileObject(TESTING_DIR_FILE2))
      .fork(fail('addLines failed'), function(fileObj) {
        expect(fileObj.lines.length).to.equal(0);
        done();
      });
    });

    it('adds nothing if file path is not valid', function(done) {
      Lines.addLines(FileObject(path.join(__dirname, 'testing_dir', 'fail.js')))
      .fork(function(fileObj) {
        expect(fileObj.lines.length).to.equal(0);
        done();
      }, fail('addLines failed'));
    });

    it('adds nothing if file path is not a file', function(done) {
      Lines.addLines(FileObject(path.join(__dirname, 'testing_dir')))
      .fork(function(fileObj) {
        expect(fileObj.lines.length).to.equal(0);
        done();
      }, fail('addLines failed'));
    });
  });
});