const { getSearchTerm, addBooksToList } = require('./inquirer');
const { fetchBooks } = require('./search_results');
const { includedInReadingList } = require('./validators');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ books: []}).write();

const _ = require("lodash"); 

const chalk = require('chalk');

module.exports = {
    list: async () => {
        const readingListBooks = db.get('books').value();
        console.log(chalk.cyan.bold('READING LIST:'));
        console.table(readingListBooks);
    },
    query: async () => {
        module.exports.list(); // General Thoughts (4)
        while (true) { // search_results.js (1)
            try {
                const search = await getSearchTerm();
                const searchResults = await fetchBooks(search.term);
                const selectedBooksToAdd = await addBooksToList(searchResults);
                const rejectedTitles = [];
                
                let readingList = db.get('books').value();
                selectedBooksToAdd.selected.forEach(book => { // (1)
                    if (includedInReadingList(readingList, book)) {
                        rejectedTitles.push(book.title);
                    } else {
                        db.get('books')
                            .push(_.omit(book, 'aggregate'))
                            .write();
                    }
                })
        
                const readingListBooks = db.get('books').value();
                console.log(chalk.cyan.bold('UPDATED READING LIST:'));
                console.table(readingListBooks);
                if (rejectedTitles.length) {
                    console.log(chalk.red(`These titles already exist in the reading list: ${rejectedTitles}`));
                };
                break;
            } catch (err) {
                continue;
            }
        }
    }
}
