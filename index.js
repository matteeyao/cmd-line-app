#!/usr/bin/env node

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
