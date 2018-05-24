const fs = require('fs');
const path = require('path');
const safe = require('safe-regex');
const esprima = require('esprima');
const assert = require('assert');

const ignoreFolders = [
  'node_modules',
  '.git',
  '.cfignore',
  'bower_components',
];

const dir = process.argv[2] || '.';
let vulnerabilities = 0;

fs.readdir(dir, handleDirectories(dir));

function handleDirectories(dirPath) {
  return (err, directories) => {
    directories.forEach(handleDescriptor(dirPath));
  };
}

function handleDescriptor(dirPath) {
  return (descriptor) => {
    const filePath = path.join(dirPath, descriptor);
    const file = fs.lstatSync(filePath);

    if (file.isDirectory()) {
      if (!ignoreFolders.includes(descriptor)) {
        fs.readdir(filePath, handleDirectories(filePath));
      }
    } else {
      if (/\.js$/.test(filePath)) {
        handleJsFile(filePath);
      }
    }
  };
}

function handleJsFile(filePath) {
  fs.readFile(filePath, 'utf8', handleFile);

  function handleFile(err, data) {
    assert.ifError(err);
    esprima.tokenize(data, { loc: true, range: true }, handleToken);

    function handleToken(node) {
      if (node.type === 'RegularExpression') {
        if (!safe(node.value)) {
          console.log('\n', filePath, 'line', node.loc.start.line, 'column', node.loc.start.column);
          console.log(node.value);
          vulnerabilities += 1;
        }
      }
    }
  }
}

process.on('uncaughtException', () => { });

process.on('beforeExit', () => {
  if (vulnerabilities) {
    console.log('\nWas found', vulnerabilities, 'vulnerabilities');
    process.exit(1);
  }
});

