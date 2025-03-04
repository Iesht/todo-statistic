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
    let todos = [];
    const exp = /\/\/\s*(TODO)\W*[:\s]*(.*)/i;
    for (const file of files) {
        const lines = file.split(/\r?\n/);
        for (const line of lines) {
            const match = line.match(exp);
            if (match) {
                let todo = match[2].trim();
                todos.push(todo);
                parseTODO(todo);
            }
        }
    }
    return todos;
}

function parseTODO(todo) {

    let countExcl = todo.split('!').length - 1;
    if (countExcl > 0) {

        if (!importantTODOs[countExcl - 1]) {
            importantTODOs[countExcl - 1] = [];
        }
        importantTODOs[countExcl - 1].push(todo);
    } else {

        let parts = todo.split(';');
        if (parts.length === 3) {
            let name = parts[0].toLowerCase().trim();
            if (!userTODOs[name]) {
                userTODOs[name] = [];
            }

            userTODOs[name].push(todo);
        }
    }
}

function parseTodoLine(todo) {
    let importance = todo.includes('!') ? '!' : '';
    let user = '';
    let date = '';
    let comment = '';
    let parts = todo.split(';');
    if (parts.length === 3) {
        user = parts[0].trim();
        date = parts[1].trim();
        comment = parts[2].trim();
    } else {
        comment = todo;
    }
    return {importance, user, date, comment};
}

function formatCell(text, maxWidth) {
    let str = text.toString();
    if (str.length > maxWidth) {
        str = str.slice(0, maxWidth - 3) + '...';
    }
    return str.padEnd(maxWidth, ' ');
}

function formatRow(todoObj) {
    const col1 = formatCell(todoObj.importance, 1);
    const col2 = formatCell(todoObj.user, 10);
    const col3 = formatCell(todoObj.date, 10);
    const col4 = formatCell(todoObj.comment, 50);
    return `  ${col1}  |  ${col2}  |  ${col3}  |  ${col4}`;
}

function printTable(todosArray) {
    for (const todo of todosArray) {
        const parsed = parseTodoLine(todo);
        console.log(formatRow(parsed));
    }
}

function processCommand(command) {
    switch (true) {
        case command === 'exit':
            process.exit(0);
            break;

        case command === 'show':
            printTable(TODOs);
            break;

        case command === 'important':
            const sortedKeys = Object.keys(importantTODOs).sort((a, b) => b - a);
            let resultImp = [];
            for (const key of sortedKeys) {
                resultImp = resultImp.concat(importantTODOs[key]);
            }
            printTable(resultImp);
            break;

        case command.startsWith('user'): {
            let user = command.slice(5).toLowerCase().trim();
            if (userTODOs[user] && userTODOs[user].length > 0) {
                printTable(userTODOs[user]);
            } else {
                console.log(`нет todo с юзером ${user}`);
            }
        }
            break;

        case command.startsWith('sort'): {
            let sortType = command.slice(5).trim();
            let sorted = [];
            switch (true) {
                case sortType === 'importance':
                    sorted = [...TODOs].sort((a, b) =>
                        (b.match(/!/g) || []).length - (a.match(/!/g) || []).length
                    );
                    break;
                case sortType === 'user':
                    sorted = [...TODOs].sort((a, b) => {
                        let pa = parseTodoLine(a).user.toLowerCase();
                        let pb = parseTodoLine(b).user.toLowerCase();
                        if (pa === '' && pb !== '') return 1;
                        if (pa !== '' && pb === '') return -1;
                        return pa.localeCompare(pb);
                    });
                    break;
                case sortType === 'date':
                    sorted = [...TODOs].sort((a, b) => {
                        let dateA = a.match(/\d{4}-\d{2}-\d{2}/);
                        let dateB = b.match(/\d{4}-\d{2}-\d{2}/);
                        if (!dateA) return 1;
                        if (!dateB) return -1;
                        return new Date(dateB[0]) - new Date(dateA[0]);
                    });
                    break;
                default:
                    console.log('wrong sort type');
                    return;
            }
            printTable(sorted);
        }
            break;

        case command.startsWith('date '): {
            const dateStr = command.slice(5).trim();
            if (!/^\d{4}(-\d{2})?(-\d{2})?$/.test(dateStr)) {
                console.log('wrong date format');
                break;
            }
            const parts = dateStr.split('-');
            const year = parts[0];
            const month = parts[1] || '01';
            const day = parts[2] || '01';
            const inputDate = new Date(year, month - 1, day);

            const filteredTODOs = TODOs.filter(todo => {
                let todoParts = todo.split(';');
                if (todoParts.length < 2) return false;
                let todoDateStr = todoParts[1].trim();
                let todoDate = new Date(todoDateStr);
                if (isNaN(todoDate)) return false;
                return todoDate > inputDate;
            });
            printTable(filteredTODOs);
        }
            break;

        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
