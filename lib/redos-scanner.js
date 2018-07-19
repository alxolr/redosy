const { Writable } = require('stream');
const esprima = require('esprima');
const fs = require('fs');
const safe = require('safe-regex');

class RedosScanner extends Writable {
  constructor() {
    super();
    this.issues = {};
  }

  _write(filePath, enc, next) {
    const instance = this;
    fs.readFile(filePath, 'utf8', handleFile);

    function handleFile(err, file) {
      try {
        esprima.tokenize(file, { loc: true, range: true }, handleToken(instance, filePath));
      } catch (err) {} // eslint-disable-line
      next();
    }
  }

  displayIssues() {
    Object.keys(this.issues)
      .forEach((key) => {
        console.error(`\n${key}`);

        this.issues[key]
          .forEach((issue) => {
            console.error(issue.regexp, 'on line', issue.line, 'column', issue.column);
          });
      });
  }
}

module.exports = RedosScanner;

function handleToken(instance, filePath) {
  return (node) => {
    if (node.type === 'RegularExpression') {
      if (!safe(node.value)) {
        if (!instance.issues[filePath]) {
          instance.issues[filePath] = []; // eslint-disable-line
        }

        const issue = {
          regexp: node.value,
          line: node.loc.start.line,
          column: node.loc.start.column,
        };

        instance.issues[filePath].push(issue);
      }
    }
  };
}
