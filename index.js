'use strict';

const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

const ignoredFolders = [
  'node_modules',
  '.git',
  '.cfignore',
  'bower_components',
];

const readable = new Readable({
  read() { },
});
const dir = process.argv[2] || '.';

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
      if (!ignoredFolders.includes(descriptor)) {
        fs.readdir(filePath, handleDirectories(filePath));
      }
    } else {
      if (/\.js$/.test(filePath)) {
        readable.push(filePath);
      }
    }
  };
}

readable
  .pipe(process.stdout);

