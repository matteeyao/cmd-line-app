const chai = require('chai');
const { expect } = chai;
const { should } = chai.should();
const inquirer = require('inquirer');
const Inquirer = require('../lib/inquirer');

describe('Inquirer', () => {
  let backup;

  before(() => {
    backup = inquirer.prompt;
    inquirer.prompt = (question) => Promise.resolve({term: 'test'});
  });

  describe('Inquire for search term "test"', () => {
    it('Should equal "test"', () => {
        Inquirer.getSearchTerm().then(answer => expect(answer.term).to.equal('test'));
    });
  });

  after(() => {
    inquirer.prompt = backup;
  });

  describe('Correctly generates a display string from book info', () => {
    it('Should equal "Title: Hercules | Authors: Jennifer Posedel, Stephen Lawton | Publisher: Arcadia Publishing"', () => {
        let book = {
            "title": "Hercules",
            "authors": "Jennifer Posedel, Stephen Lawton",
            "publisher": "Arcadia Publishing"
        };
        expect(Inquirer._generateInfoString(book)).to.equal("Title: Hercules | Authors: Jennifer Posedel, Stephen Lawton | Publisher: Arcadia Publishing");
    });
  });
});
