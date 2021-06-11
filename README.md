# Node.js Command Line Application

## Demo

<img src="./assets/images/app-demo.gif" alt="App Demo" style="height:400px;"/>

## Quickstart steps (if applicable)

1. Clone repo

2. Use the command line to `cd` into the root directory

3. Run `npm install` 

4. Execute `node index.js q` to send a search query to Google Books API or `node index.js ls` to view reading list


## App dependencies

* **`commander`** ― module that helps us construct our CLI interface

* **`inquirer`** ― creates interactive command-line user interface

* **`axios`** ― light-weight module that allows us make requests to external services to fetch data

* **`lowdb@1.0.0`** ― light-weight JSON database for small projects

* **`chalk`** ― colorizes command line output

## Project setup

The application's main dependency `commander` module is set up in the root directory file `index.js`, and provides the core functionality and interface for this command line application.

```js
// index.js

const app = require('commander');
const { query, list } = require('./lib/commands');

app
  .version('0.0.1')
  .description('Search Google Books and create a reading list.')

app
  .command('list')
  .alias('ls')
  .description('view the locally-stored reading list...')
  .action(function () {
    list();
  });

app
  .command('query')
  .alias('q')
  .description('search Google Books library for a title...')
  .action(function() {
    query();
  });

app.parse(process.argv);
```

Let’s go over what each piece of the code above does:

* `.version` allows us to define the current version of our command line application

* `.command` defines how the parameter should be passed to the program w/ any extra arguments

* `.alias` defines an alternative short form parameter that can be passed to the program instead of typing a longer one.

* `description` is the description of the alias

* `.action` will call whatever function is passed to it. The action runs the functions and displays whatever is returned from the function. The action is also responsible for handling interactions with the user if the command line application is an interactive application.

The two commands enabled are `list` and `query` and can be executed also by the aliases `ls` or `q`, respectively. In other words, both commands can be run by calling

```
node index.js list
```

or

```
node index.js ls
```

The `.action` attributes of the `commander` CLI interface calls `list` or `query`, functions detailed in the `commands.js` file within the `lib` directory. The `lib` directory is where the "meat" of the application lives.

Because the `list` method performs the same logic as the end of the `query` method, we will not be covering the `list` method. The `query` method looks like this:

```js
// lib/commands.js

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
                        .write()
                }
            })
        }

        const readingListBooks = db.get('books').value();
        console.log(chalk.cyan.bold('READING LIST'));
        console.table(readingListBooks);
        if (rejectedTitles.length) {
            console.log(chalk.red(`These titles already exist in the reading list: ${rejectedTitles}`))
        }
    }
```

1. First, we invoke and wait for `getSearchTerm`, a method that uses the `inquirer` module to ask for a search input from the user

2. With this term, we pass it to `fetchBooks`, which makes an axios query search to the Google Books API using this term, takes the first five search results, and trims the resulting books for `title`, `authors`, and `publisher`

3. `selectedBooksToAdd` is another `inquirer` process which allows the user to select any number of the five search result books to add to the reading list, which is stored in `db.json` using our dependency `lowdb`

4. After the user selects which of the five books to add, a quick validation, `includedInReadingList`, is run to ensure that no duplicate books are added to the reading list.

5. Finally, we `console.table` the information for each book within our local database, logic that is akin to that within the `list` command.
