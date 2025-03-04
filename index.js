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
    if (!importantTODOs[count - 1]) {
      importantTODOs[count - 1] = [];
    }
    importantTODOs[count - 1].push(todo);
  } else {
    let parts = todo.split(';');
    count = parts.length - 1;
    if (count === 2) {
      let name = parts[0].toLowerCase();
      if (!userTODOs[name]) {
        userTODOs[name] = [];
      }
      userTODOs[name].push(parts[2]);
    }
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
      let user = command.slice(5).toLowerCase();
      if (userTODOs[user] !== []) {
        for (const todo of userTODOs[user]) {
          console.log(todo);
        }
      } else {
        console.log(`нет todo с юзером ${user}`);
      }
      break;
    case command.startsWith('sort'):
      let sortType = command.slice(5).trim();
      switch (true) {
        case sortType === 'importance':
          TODOs.sort((a, b) => (b.match(/!/g) || []).length - (a.match(/!/g) || []).length);
          TODOs.forEach(todo => console.log(todo));
          break;
        case sortType === 'user':
          Object.keys(userTODOs)
            .sort((a, b) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b)))
            .forEach(user => {
              userTODOs[user].forEach(todo => console.log(`${user}: ${todo}`))
            })
          const anonTODOs = TODOs.filter(todo => !todo.includes(';'));
          if (anonTODOs.length > 0) {
            console.log('--- Без пользователя ---');
            anonTODOs.forEach(todo => console.log(todo));
          }
          break;
        case sortType === 'date':
          TODOs.sort((a, b) => {
            let dateA = a.match(/\d{4}-\d{2}-\d{2}/);
            let dateB = b.match(/\d{4}-\d{2}-\d{2}/);
            if (!dateA) return 1;
            if (!dateB) return -1;
            return new Date(dateB[0]) - new Date(dateA[0]);
          });
          TODOs.forEach(todo => console.log(todo));
          break;
      }
      break;
    default:
      console.log('wrong command');
      break;
  }
}

// TODO you can do it!
