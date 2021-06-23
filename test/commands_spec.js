const chai = require('chai');
const { expect } = chai;
const { should } = chai.should();
const Commands = require('../lib/commands');
const Validators = require('../lib/validators');
const sinon = require('sinon');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const chalk = require('chalk');

describe('Command Functions', () => {
    let readingListBooks, rejectedTitles;

    before(function() {
        sinon.stub(console, 'table');
        sinon.stub(console, 'log');
        Commands.query = () => Promise.resolve({term: 'hercules'});
        Commands.query = () => Promise.resolve({rejectedTitles: ["Hercules"]});
    });

    describe('Reading List', () => {
        it('Should print reading list', () => {
            Commands.list();
            expect( console.log.called ).to.be.true;
            expect( console.table.called ).to.be.true;
            readingListBooks = db.get('books').value();
            expect( console.table.calledWith(readingListBooks) ).to.be.true;
        })
    });

    describe('Rejected List', () => {
        it('Should print rejected list', () => {
            Commands.query();
            expect( console.log.called ).to.be.true;
            expect( console.table.called ).to.be.true;
            expect( Validators.includedInReadingList(readingListBooks, {
                "title": "Hercules",
                "authors": "Jennifer Posedel, Stephen Lawton",
                "publisher": "Arcadia Publishing"
            })).to.be.true;
        })
    });
});
