const axios = require("axios");
const API_KEY = require("../config/keys").API_KEY;
const chalk = require('chalk');

const fetchBooks = async (searchTerms) => {
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&key=${API_KEY}`;
        const res = await axios.get(url);
        const { data } = res;
        const firstFiveSearchResults = data.items
            .slice(0, 5)
            .map(book => {
                return _abbreviateBookInfo(book);
            });
        // console.log(firstFiveSearchResults);
        return firstFiveSearchResults;
    } catch (err) {
        console.log(chalk.red("Unable to retrieve any books using that search term, please enter a new search term and try again."));
        throw err;
    };
};

function _abbreviateBookInfo(book) {
    const { title, authors, publisher } = book.volumeInfo;
    const bookInfo = {};
    if (title) bookInfo.title = title;
    if (authors) bookInfo.authors = authors.join(', ');
    if (publisher) bookInfo.publisher = publisher;
    return bookInfo;
}

module.exports = { fetchBooks };
