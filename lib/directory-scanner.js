const { EventEmitter } = require('events');
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');

class DirectoryScanner extends EventEmitter {
  constructor(options) {
    super();
    this.options = options || {
      ignore: [],
    };
  }

  scan(dir) {
    const { options } = this;
    return new Readable({
      encoding: 'utf8',
      read(size) {
        scanDirectory(dir, this, options);
        this.push(null);
      }
    });

    return stream;
  }
}


function scanDirectory(directory, instance, options) {
  const directories = fs.readdirSync(directory);
  directories.forEach(handleDescriptor(directory, instance, options));
}

function handleDescriptor(descriptorPath, instance, options) {
  return (descriptor) => {
    const filePath = path.join(descriptorPath, descriptor);
    const file = fs.lstatSync(filePath);

    if (file.isDirectory()) {
      if (!options.ignore.includes(descriptor)) {
        scanDirectory(filePath, instance, options);
      }
    } else {
      if (!options.ignore.includes(descriptor)) {
        instance.push(filePath);
      }
    }
  }
}

module.exports = DirectoryScanner;

