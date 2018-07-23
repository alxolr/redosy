/* eslint-env mocha */

const RedosScanner = require('../../lib/redos-scanner');
const DirectoryScanner = require('../../lib/directory-scanner');
const path = require('path');
const { Writable } = require('stream');
const assert = require('assert');

const directoryScanner = new DirectoryScanner({
  ignore: ['node_modules', '.git', 'test'],
  extensions: ['.js'],
});

const dir = path.join(__dirname, '../', '../');

describe('RedosScanner', () => {
  it('should be instance of writable stream', () => {
    const redosScanner = new RedosScanner();
    assert.equal(redosScanner instanceof Writable, true);
  });

  it('should load the code for the javascript files', (next) => {
    const redosScanner = new RedosScanner();

    directoryScanner
      .scan(dir)
      .pipe(redosScanner)
      .on('finish', () => {
        next();
      });
  });

  it('should tokenize the file and get the regex nodes', (next) => {
    const redosScanner = new RedosScanner();
    directoryScanner
      .scan(dir)
      .pipe(redosScanner)
      .on('finish', () => {
        assert.equal(Object.keys(redosScanner.issues).length, 1);
        next();
      });
  });

  it('should display on screen the issues', (next) => {
    const redosScanner = new RedosScanner();
    directoryScanner
      .scan(dir)
      .pipe(redosScanner)
      .on('finish', () => {
        assert.equal(Object.keys(redosScanner.issues).length, 1);
        next();
      });
  });

  it('should ignore a disabled redosy line', (next) => {
    const redosScanner = new RedosScanner();
    directoryScanner
      .scan(dir)
      .pipe(redosScanner)
      .on('finish', () => {
        const key = path.resolve(path.resolve(__dirname, '../', '../', 'index.js'));
        assert.equal(redosScanner.issues[key].length, 2);
        next();
      });
  });
});
