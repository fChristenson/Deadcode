// Path->{}
function FileObject(path) {
  return {
    path: path,
    imports: [],
    lines: []
  };
}

// a->a
function valToVal(a) {
  return a;
}

function emptyArray() {
  return [];
}

module.exports = {
  FileObject: FileObject,
  valToVal: valToVal,
  emptyArray: emptyArray
};
