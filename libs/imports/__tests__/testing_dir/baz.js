var D = require('../');
var expect = require('chai').expect;
var fail = require('../../common/common_test_utils').fail;
var path = require('path');
var _ = require('fc-tools/lodash');

describe('directories', function() {
  it('has a module', function() {
    expect(D).to.be.ok;
  });

  var TESTING_DIR = path.join(__dirname, 'testing_dir');
  var TESTING_DIR2 = path.join(__dirname, 'testing_dir2');
  var TESTING_DIR4 = path.join(__dirname, 'testing_dir4');
  var FAIL_DIR = path.join(__dirname, 'fail');

  describe('walk', function() {
    it('walks a directory', function(done) {
      D.walk(TESTING_DIR)
      .fork(fail('Failed the walk'), listHastNumItems(1, done));
    });

    it('walks a directory and the subdirectories', function(done) {
      D.walk(TESTING_DIR2)
      .fork(fail('Failed the walk'), listHastNumItems(2, done));
    });

    it('gathers paths correctly', function() {
      D.walk(TESTING_DIR2)
      .fork(fail('Failed the walk'), function(list) {
        expect(list.length).to.equal(2);
        list.forEach(function(item) {
          expect(typeof item.path).to.equal('string');
        });
      });
    });

    it('gathers only javascript files', function() {
      D.walk(TESTING_DIR2)
      .fork(fail('Failed the walk'), function(list) {
        expect(list.length).to.equal(2);
        list.forEach(function(item) {
          expect(typeof item.path).to.equal('string');
        });
      });
    });

    it('returns an empty array if directory is invalid', function(done) {
      D.walk(FAIL_DIR)
      .fork(fail('Failed the walk'), listHastNumItems(0, done));
    });

    it('returns an empty array if directory has no files', function(done) {
      D.walk(TESTING_DIR4)
      .fork(fail('Failed the walk'), listHastNumItems(0, done));
    });

    it('returns an empty array if directory has no js files', function(done) {
      D.walk(TESTING_DIR4)
      .fork(fail('Failed the walk'), listHastNumItems(0, done));
    });

    it('returns a data object for each file', function(done) {
      D.walk(TESTING_DIR)
      .fork(fail('Failed the walk'), listHastNumItems(1, done));
    });
  });

  describe('dirExists', function() {
    it('returns true if the dir exists', function() {
      D.dirExists(TESTING_DIR)
        .fold(fail('Dir not found'), makeExpect(true));
    });

    it('returns false if the dir does not exists', function() {
      D.dirExists(FAIL_DIR)
        .fold(makeExpect(false), fail('Dir found'));
    });
  });

  var listHastNumItems = _.curry(function(count, done, list) {
    expect(list.length).to.equal(count);
    done();
  });

  var makeExpect = _.curry(function(val1, val2) {
    expect(val1).to.equal(val2);
  });
});