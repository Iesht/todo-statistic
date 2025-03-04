const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const importantTODOs = {};
const userTODOs = {};
const TODOs = getTODOs();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
  return filePaths.map(path => readFile(path));
}

function getTODOs() {
  let todos = []
  const exp = /\/\/\s*(TODO|todo|ToDo|tOdO|tODO|toDo|ToDO)\W*[:\s]*(.*)/i;
  const oldPattern = /^\s*\/\/ TODO\s+(.*)$/;
  for (const file of files) {
    for (const line of file.split('\r\n')) {
      const match = line.match(exp);
      if (match) {
        let todo = match[2];
        todos.push(todo);
        parseTODO(todo);
      }
    }
  }
  return todos;
}

function parseTODO(todo) {
  let count = todo.split('!').length - 1;
  if (count > 0) {
    if (!importantTODOs[count]) {
      importantTODOs[count] = [];
    }
    importantTODOs[count].push(todo);
  }
}

function processCommand(command) {
  switch (command) {
    case 'exit':
      process.exit(0);
      break;
    case 'show':
      for (const todo of TODOs) {
        console.log(todo);
      }
      console.log(importantTODOs);
      break;
    default:
      console.log('wrong command');
      break;
  }
}

// TODO you can do it!
