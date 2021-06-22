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
    query: async () => {
        const search = await getSearchTerm();
        const searchResults = await fetchBooks(search.term);
        const selectedBooksToAdd = await addBooksToList(searchResults);
        const rejectedTitles = [];
        
        let readingList = db.get('books').value();
        if (selectedBooksToAdd.selected.length) {
            selectedBooksToAdd.selected.forEach(book => {                
                if (includedInReadingList(readingList, book)) {
                    rejectedTitles.push(book.title);
                } else {
                    db.get('books')
                        .push(_.omit(book, 'aggregate'))
                        .write();
                }
            })
        }

        const readingListBooks = db.get('books').value();
        console.log(chalk.cyan.bold('READING LIST'));
        console.table(readingListBooks);
        if (rejectedTitles.length) {
            console.log(chalk.red(`These titles already exist in the reading list: ${rejectedTitles}`));
        }
    },
    list: async () => {
        const readingListBooks = db.get('books').value();
        console.log(chalk.cyan.bold('READING LIST:'));
        console.table(readingListBooks);
    }
}
