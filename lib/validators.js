module.exports = {
    includedInReadingList: (db, book) => {
        return db.some(row => (
            row.title === book.title && row.author === book.author
        ));
    }
}