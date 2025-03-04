const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODOs = getTODOs();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function getTODOs() {
    let todos = []
    for (const file of files) {
        for (const line of file.split('\r\n')) {
            const match = line.match(/^\/\/ TODO\s+(.*)$/);
            if (match) {
                todos.push(match[1]);
            }
        }
    }
    return todos;
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
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
