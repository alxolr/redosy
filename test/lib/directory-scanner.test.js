/* environment mocha */

const DirectoryScanner = require('../../lib/directory-scanner');
const assert = require('assert');
const { Readable, Writable } = require('stream');
const { EventEmitter } = require('events');
const path = require('path');

describe('DirectoryScanner', () => {
  it('should exist the DirectoryScanner instance of EventEmitter', () => {
    const directory = new DirectoryScanner();

    assert.equal(directory instanceof EventEmitter, true);
  });

  it('should have the scan method that is a readable stream', (next) => {
    const directory = new DirectoryScanner();
    const writable = new Writable({ write() { } });
    directory
      .scan(__dirname)
      .on('end', () => next())
      .pipe(writable);
  });

  it('should scan all the folders from a specified directory and push the paths', (next) => {
    const scanner = new DirectoryScanner();
    const actual = [];
    const expected = [__filename];

    scanner.scan(path.join(__dirname, '../'))
      .on('end', () => {
        assert.deepEqual(actual, expected);
        next();
      })
      .pipe(new Writable({
        write(chunk, enc, done) {
          actual.push(chunk.toString());
          done();
        }
      }));
  });

  it('should be able to ignore folders and files', (next) => {
    const scanner = new DirectoryScanner({
      ignore: [
        'node_modules',
        '.git',
        'directory-scanner.js'
      ],
      extensions: [],
    });

    let files = 0;

    scanner.scan(path.join(__dirname, '../', '../'))
      .on('end', () => {
        assert.deepEqual(files, 8);
        next();
      })
      .pipe(new Writable({
        write(chunk, enc, done) {
          files += 1;
          done();
        }
      }));
  });

  it('should permit to extract only specific file extensions', (next) => {
    const options = {
      ignore: [
        'node_modules',
        '.git'
      ],
      extensions: [
        '.js',
      ],
    };
    let files = 0;

    const scanner = new DirectoryScanner(options);
    scanner.scan(path.join(__dirname, '../', '../'))
      .on('end', () => {
        assert.equal(files, 3);
        next();
      })
      .pipe(new Writable({
        write(chunk, enc, done) {
          files += 1;
          done();
        }
      }));

  });
});
