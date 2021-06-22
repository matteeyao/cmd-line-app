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
        console.log(chalk.red("Error in retrieving books ―", err));
        throw err;
    };
};

function _abbreviateBookInfo(book) {
    const { title, authors, publisher } = book.volumeInfo;
    const bookInfo = {};
    if (title) bookInfo.title = title;
    if (authors) bookInfo.authors = authors.join(', ');
    if (publisher) bookInfo.publisher = publisher;
    bookInfo.aggregate = _generateInfoString(bookInfo);

    return bookInfo;
}

function _generateInfoString(bookInfo) {
    const title = bookInfo.title ? `Title: ${bookInfo.title}` : "";
    const authors = bookInfo.authors ? `| Authors: ${bookInfo.authors}` : "";
    const publisher = bookInfo.publisher ? `| Publisher: ${bookInfo.publisher}`: "";
    return `${title} ${authors} ${publisher}`.trim();
}

module.exports = { fetchBooks };
