var assert = require('chai').assert;

// a->_
function fail(text) {
  return function() {
    assert.fail(null, null, text);
  };
}

module.exports = {
  fail: fail
};
