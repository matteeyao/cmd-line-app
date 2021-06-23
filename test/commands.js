const chai = require('chai');
const { expect } = chai;
const { should } = chai.should();
const Commands = require('../lib/commands');

describe('Command Functions', () => {

    // reading list

    
//   let firstFiveSearchResults;
//   let firstResult;

//   describe('/GET books', () => {
//     it('Should GET books', (done) => {
//       chai.request(`https://www.googleapis.com`)
//           .get(`/books/v1/volumes?q=${"hercules"}&key=${API_KEY}`)
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.items.should.be.a('array');
//             firstFiveSearchResults = res.body.items.slice(0, 5);
//             expect(firstFiveSearchResults).to.not.equal(undefined);
//             done();
//           });
//       });
//   });

//   describe('First Five Search Results', () => {
//     it('Should return first five search results', () => {
//       firstResult = firstFiveSearchResults[0].volumeInfo;
//       expect(firstFiveSearchResults).to.be.an('array').that.is.not.empty;
//       expect(firstFiveSearchResults.length).to.be.eql(5);
//       expect(firstResult).to.have.property('title');
//       expect(firstResult).to.have.property('authors');
//       expect(firstResult).to.have.property('publisher');
//     })
//   });
})
