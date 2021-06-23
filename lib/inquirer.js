const inquirer = require('inquirer');

module.exports = {
  getSearchTerm: () => {
    return inquirer.prompt({
      type: 'input',
      name: 'term',
      message: 'Search Google Books library by entering a keyword: ',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a search term.';
        }
      }
    })
  },
  _generateInfoString: (bookInfo) => { // search_results (2)
    const title = bookInfo.title ? `Title: ${bookInfo.title}` : "";
    const authors = bookInfo.authors ? `| Authors: ${bookInfo.authors}` : "";
    const publisher = bookInfo.publisher ? `| Publisher: ${bookInfo.publisher}`: "";
    return `${title} ${authors} ${publisher}`.trim();
  },
  addBooksToList: (searchResults) => {
    const searchResultDisplayInfo = searchResults.map(result => {
      result.aggregate = module.exports._generateInfoString(result); // search_results (2)
      return result.aggregate;
    });

    const questions = [{
      type: 'checkbox',
      name: 'selected',
      message: 'Select which books to add to your local reading list: ',
      choices: searchResultDisplayInfo,
      filter: function (val) {
        return searchResults.filter(result => {
          return val.includes(result.aggregate);
        });
      }
    }];
    return inquirer.prompt(questions);
  }
};
