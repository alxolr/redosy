const { EventEmitter } = require('events');
const { Readable } = require('stream');

class DirectoryScanner extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  scan(dir) {
    const { options } = this;
    const stream = new Readable({
      read() {
        this.push(null);
      }
    });

    return stream;
  }
}

module.exports = DirectoryScanner;
