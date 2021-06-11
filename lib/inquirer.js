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
          return 'Please enter a search term.'
        }
      }
    })
  },
  addBooksToList: (searchResults) => {
    const searchResultDisplayInfo = searchResults.map(result => (
      result.aggregate
    ));

    const questions = [{
      type: 'checkbox',
      name: 'selected',
      message: 'Select which books to add to your local reading list:',
      choices: searchResultDisplayInfo,
      filter: function (val) {
        return searchResults.filter(result => {
          return val.includes(result.aggregate);
        })
      }
    }];
    return inquirer.prompt(questions);
  }
}
