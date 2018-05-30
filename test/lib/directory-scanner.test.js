/* environment mocha */

const DirectoryScanner = require('../../lib/directory-scanner');
const assert = require('assert');
const { Readable } = require('stream');
const { EventEmitter } = require('events');

describe('DirectoryScanner', () => {
  it('should exist the DirectoryScanner instance of Readable', () => {
    const directory = new DirectoryScanner();

    assert.equal(directory instanceof EventEmitter, true);
  });
});
