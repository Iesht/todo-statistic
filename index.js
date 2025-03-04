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
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;
        case command === 'show':
            for (const todo of TODOs) {
                console.log(todo);
            }
            break;
        case command === 'important':
            const sortedKeys = Object.keys(importantTODOs).sort((a, b) => b - a);

            for (const key of sortedKeys) {
                const tasks = importantTODOs[key];
                for (const task of tasks) {
                    console.log(task);
                }
            }
            break;
        case command.startsWith('user'):
            let user = command.slice(5);
            if (userTODOs.includes(user)){
                for (const todo of userTODOs[user]) {
                    console.log(todo);
                }
            } else {
                console.log(`нет todo с юзером ${user}`);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
