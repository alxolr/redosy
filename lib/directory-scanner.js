const { EventEmitter } = require('events');
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');

class DirectoryScanner extends EventEmitter {
  constructor(options) {
    super();
    this.options = options || {
      ignore: [],
      extensions: []
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
      if (!options.ignore.includes(descriptor) && isValidExtension(descriptor, options.extensions)) {
        instance.push(filePath);
      }
    }
  }
}

function isValidExtension(file, extensions) {
  let flag = false;
  if (extensions.length) {
    extensions.forEach((ex) => {
      const regexp = new RegExp(`${ex}$`, 'i');
      if (regexp.test(file)) {
        flag = true;
      }
    });

    return flag;
  }

  return true;
}

module.exports = DirectoryScanner;

