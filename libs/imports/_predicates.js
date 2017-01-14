var _ = require('fc-tools/lodash');

// String->Bool
function isCommonJsImport(str) {
  return /^import .+ from /.test(str);
}

// String->Bool
function isCommonJsRequire(str) {
  return /.*require\(['"].+['"]\).*/.test(str);
}

// String->Bool
function isIndexPath(str) {
  return /index$/.test(str);
}

// String->Bool
function hasFileExtension(str) {
  return /.+\.[a-zA-Z]+$/.test(str);
}

// String->Bool
function isSameDirectoryRelativePath(str) {
  return /^\.\//.test(str);
}

// String->Bool
function isDoubleDot(str) {
  return /^\.\.$/.test(str);
}

// String->Bool
function isRelativeIndexImport(str) {
  if(typeof str === 'string') {
    return /^(\.\.\/)*$/.test(str);
  }

  return false;
}

// val->Bool
function isNotEmptyString(str) {
  return str !== '';
}

// FileObject->Bool
function removeEmptyPaths(obj) {
  return _.get(obj, 'path', '') !== '';
}

// String->Bool
function isNodeModuleImport(str) {
  if(typeof str === 'string') {
    return /^\.+{1, 2}\/\.*/.test(str);
  }

  return false;
}

// String->Bool
function isCommonJsLine(str) {
  return isCommonJsImport(str) || isCommonJsRequire(str);
}

// String->Bool
function isNotDoubleDot(str) {
  return !isDoubleDot(str);
}

module.exports = {
  isNotDoubleDot: isNotDoubleDot,
  isCommonJsLine: isCommonJsLine,
  isNodeModuleImport: isNodeModuleImport,
  isSameDirectoryRelativePath: isSameDirectoryRelativePath,
  isNotEmptyString: isNotEmptyString,
  isRelativeIndexImport: isRelativeIndexImport,
  hasFileExtension: hasFileExtension,
  isIndexPath: isIndexPath,
  isCommonJsRequire: isCommonJsRequire,
  isCommonJsImport: isCommonJsImport,
  removeEmptyPaths: removeEmptyPaths,
  isDoubleDot: isDoubleDot
};
