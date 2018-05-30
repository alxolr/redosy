/* environment mocha */

const DirectoryScanner = require('../../lib/directory-scanner');
const assert = require('assert');
const { Writable } = require('stream');
const { EventEmitter } = require('events');

describe('DirectoryScanner', () => {
  it('should exist the DirectoryScanner instance of EventEmitter', () => {
    const directory = new DirectoryScanner();

    assert.equal(directory instanceof EventEmitter, true);
  });

  it('should have the scan method that is a readable stream', (next) => {
    const directory = new DirectoryScanner();
    const writable = new Writable({ write() { } });
    directory
      .scan()
      .on('end', () => next())
      .pipe(writable);
  });

  it('should scan all the folders from a specified directory and push the paths', (next) => {
    const scanner = new DirectoryScanner();
  });
});
