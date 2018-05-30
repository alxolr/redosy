const DirectoryScanner = require('./lib/directory-scanner');

const scanner = new DirectoryScanner({
  ignore: [
    'node_modules',
    '.git'
  ],
  extensions: ['.js']
});

scanner.scan(process.argv[2])
  .pipe(process.stdout);