var Imports = require('../');
var FileObject = require('../../common').FileObject;
var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

describe('imports', function() {
  it('has a module', function() {
    expect(Imports).to.be.ok;
  });

  describe('findDeadFiles', function() {
    it('returns a list of files that are not imported in any other file', function() {
      var obj = FileObject(' foo/bar/foo.js ');
      obj.lines = [
        'import foo from " ./bar.js "'
      ];

      var obj2 = FileObject(' foo/bar/bar.js ');

      var files = Imports.findDeadFiles([obj, obj2]);
      expect(files.length).to.equal(1);
      expect(files[0]).to.equal('foo/bar/foo');
    });

    it('should parse all cases of commonJS imports', function() {
      var obj = FileObject(' foo/bar/foo.js ');
      obj.lines = [
        'import foo from " ./bar.js "',
        'import foo from " ./bar "',
        'import {foo} from " ./bar.js "',
        'import {foo} from " ./bar "',
        'var foo = require("./bar.js");',
        'var foo = require("./bar");'
      ];

      var obj2 = FileObject(' /foo/bar/bar.js ');

      var files = Imports.findDeadFiles([obj, obj2]);
      expect(files.length).to.equal(1);
      expect(files[0]).to.equal('foo/bar/foo');
    });

    // there is no way to be certain of what a commonJS's files extension is
    // an import can be e.g foo.js, foo, or foo.jsx
    it('ignores file extensions', function() {
      var obj = FileObject(' foo/bar/foo.js ');
      obj.lines = [
        'import foo from " ./bar.js "'
      ];

      var obj2 = FileObject(' foo/bar/bar.js ');
      obj2.lines = [
        'import foo from " ./foo.jsx "'
      ];

      expect(Imports.findDeadFiles([obj, obj2]).length).to.equal(0);
    });

    it('trailing spaces are handled', function() {
      var obj = FileObject(' foo/bar/foo.js ');
      obj.lines = [
        'import foo from " ./BAR "'
      ];

      var obj2 = FileObject(' foo/bar/bar.js ');
      obj2.lines = [
        'import foo from " ./FOO "'
      ];

      expect(Imports.findDeadFiles([obj, obj2]).length).to.equal(0);
    });

    it('ignores casing differences', function() {
      var obj = FileObject(' foo/bar/foo.js ');
      obj.lines = [
        'import foo from "./BAR"'
      ];

      var obj2 = FileObject(' /foo/bar/bar.js ');
      obj2.lines = [
        'import foo from "./FOO"'
      ];

      expect(Imports.findDeadFiles([obj, obj2]).length).to.equal(0);
    });

    it('resolves relative index path such as "../"', function() {
      var obj = FileObject(' foo/bar/baz/index.js ');
      obj.lines = [
        'import foo from "../"'
      ];

      var obj2 = FileObject('foo/bar/index.js');
      var files = Imports.findDeadFiles([obj, obj2]);

      expect(files.length).to.equal(1);
      expect(files[0]).to.equal('foo/bar/baz');
    });

    it('resolves relative index path such as "../../"', function() {
      var obj = FileObject(' foo/bar/baz/index.js ');
      obj.lines = [
        'import foo from "../../"'
      ];

      var obj2 = FileObject('foo/index.js');
      var files = Imports.findDeadFiles([obj, obj2]);

      expect(files.length).to.equal(1);
      expect(files[0]).to.equal('foo/bar/baz');
    });

    it('ignores relative paths that go up more dir levels than there are', function() {
      var obj = FileObject(' /foo/bar/baz/index.js ');
      obj.lines = [
        'import foo from "../../../../../../../"'
      ];

      var obj2 = FileObject('foo/index.js');
      var files = Imports.findDeadFiles([obj, obj2]);

      expect(files.length).to.equal(2);
      expect(files[0]).to.equal('foo/bar/baz');
      expect(files[1]).to.equal('foo');
    });
  });

  describe('getImports', function() {
    it('handles a case like index.js', function() {
      var obj = FileObject('foo/testing_dir/index.js');
      obj.lines = fs
      .readFileSync(path.join(__dirname, 'testing_dir', 'index.js'), 'utf8')
      .split('\n');

      var files = Imports.getImports([obj]);
      expect(files.length).to.equal(2);
      expect(files[0]).to.equal('foo/common');
      expect(files[1]).to.equal('foo/directories');
    });

    it('handles a case like bax.js', function() {
      var obj = FileObject('foo/bar/testing_dir/bax.js');
      obj.lines = fs
      .readFileSync(path.join(__dirname, 'testing_dir', 'bax.js'), 'utf8')
      .split('\n');

      var files = Imports.getImports([obj]);
      console.log('files', files);
      expect(files.length).to.equal(3);
      expect(files[0]).to.equal('foo/bar');
      expect(files[1]).to.equal('foo/common');
      expect(files[2]).to.equal('foo/common/common_test_utils');
    });
  });
});