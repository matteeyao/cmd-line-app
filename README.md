# Objective

Create a command line application that allows you to use the Google Books API to search for books and construct a reading list. 

You do *not* have to use a private GitHub repo for this.

This application should allow you to:

* Type in a query and display a list of 5 books matching that query.

* Each item in the list should include the book's author, title, and publishing company.

* A user should be able to select a book from the five displayed to save to a “Reading List”

* View a `Reading List` with all the books the user has selected from their queries ―― this is a local reading list and not tied to Google Books’s account features.

---

# Question

Private github repo?

Code review?

    - naming variables

    - helper functions

        - easier to detect bugs

        - css

        - wet dry code

    - commented code

Tips or Best practices?

---

# Build a JavaScript Command Line Interface (CLI) with Node.js

Node is a great choice for building command line tools.
In this tutorial, James Hibbard and Lukas White show you how to build a Node CLI which interacts with the GitHub API.

Article URL: https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/

## Requirements

* [Node.js](http://nodejs.org/)
* [Git](https://git-scm.com/)
* [GitHub account](https://github.com/)

## Installation Steps (if applicable)

1. Clone repo
2. Run `npm install`
3. Install the module globally with `npm install -g` from within the project directory
4. Run `ginit <repo-name> <longer repo description>`

# Google books command line application

* **`commander`** ― 

* **`inquirer`** ― 

* **`axios`** ― light-weight module that allows us make requests to external services to fetch data

* **`lowdb`** ― light-weight tiny JSON database for small projects


API keys: A request that does not provide an OAuth 2.0 token must send an API key. The key identifies your project and provides API access, quota, and reports.

The API supports several types of restrictions on API keys. If the API key that you need doesn't already exist, then create an API key in the Console by clicking Create credentials > API key. You can restrict the key before using it in production by clicking Restrict key and selecting one of the Restrictions.















Code Submission
Create a command line application that allows you to use the Google Books API to search for books and construct a reading list. 

You do not have to use a private GitHub repo for this.

This application should allow you to:

Type in a query and display a list of 5 books matching that query.

Each item in the list should include the book's author, title, and publishing company.

A user should be able to select a book from the five displayed to save to a “Reading List”
View a “Reading List” with all the books the user has selected from their queries -- this is a local reading list and not tied to Google Books’s account features.

For programming language, choose any language you want as long as it is not the same language you chose to review in the Code Review section above. Feel free to use a library (or not) for the Google Books call or JSON parsing.

Please do not add any additional features. 

Your submission doesn’t need to be perfect. After we receive your submission we'll review your code, respond to you with our feedback and suggestions, and give you an opportunity to respond to our feedback and make improvements to your code before you re-submit a second and final version.

That said, we would still like to see your best work with the first version you submit. It should demonstrate external quality (for example: solves the problem, handles edge cases, usability), internal quality (for example: decoupling, testing, readability), as well as some idea of your process and approach (via your version control history and README).
