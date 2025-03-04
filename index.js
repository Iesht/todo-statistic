const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const TODOs = [];
const importantTODOs = {}

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
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
        case 'important':
            const sortedKeys = Object.keys(importantTODOs).sort((a, b) => b - a);

            for (const key of sortedKeys) {
                const tasks = importantTODOs[key];
                for (const task of tasks) {
                    console.log(task);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
