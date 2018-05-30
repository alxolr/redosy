const { EventEmitter } = require('events');
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');

class DirectoryScanner extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  scan(dir) {
    const { options } = this;
    return new Readable({
      encoding: 'utf8',
      read(size) {
        scanDirectory(dir, this);
        this.push(null);
      }
    });

    return stream;
  }
}


function scanDirectory(directory, instance) {
  const directories = fs.readdirSync(directory);
  directories.forEach(handleDescriptor(directory, instance));
}

function handleDescriptor(descriptorPath, instance) {
  return (descriptor) => {
    const filePath = path.join(descriptorPath, descriptor);
    const file = fs.lstatSync(filePath);

    if (file.isDirectory()) {
      scanDirectory(filePath, instance);
    } else {
      instance.push(filePath);
    }
  }
}

module.exports = DirectoryScanner;

