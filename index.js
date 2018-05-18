const fs = require('fs');
const path = require('path');
const readline = require('readline');
const safe = require('safe-regex');

const dir = process.argv[2] || '.';
const regex = /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/;
const ignoreFolders = ['node_modules', '.git', '.cfignore'];

fs.readdir(dir, handleDirectories(dir));

function handleDirectories(dirPath) {
  return (err, directories) => {
    directories.forEach(handleDescriptor(dirPath));
  };
}

function handleDescriptor(dirPath) {
  return (descriptor) => {
    const filePath = path.join(dirPath, descriptor);
    const file = fs.lstatSync(filePath);

    if (file.isDirectory()) {
      if (!ignoreFolders.includes(descriptor)) {
        fs.readdir(filePath, handleDirectories(filePath));
      }
    } else {
      if (/\.js$/.test(filePath)) {
        handleJsFile(filePath);
      }
    }
  };
}

function handleJsFile(filePath) {
  let index = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  rl.on('line', handleLine);

  function handleLine(line) {
    index += 1;

    const match = line.match(regex);
    if (match) {
      const candidat = match[0];
      if (!safe(candidat)) {
        console.log('\n', filePath, 'line', index);
        console.log(candidat, 'is vulnerable\n');
      }
    }
  }
}
