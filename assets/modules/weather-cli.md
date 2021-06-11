# [Understanding Node.js by building command line apps](https://pusher.com/tutorials/node-command-line-app/)

## What we'll be building

In this tutorial, we’ll be learning how to build simple command line application. We’ll be building a command line weather application using Node.js. With our command line weather application, we’ll be able to get the current weather in any city in the world. We’ll also be able to get a forecast for any specified city using a different command line parameters.

## Getting started

Let’s start by setting up our project and installing dependencies:

```zsh
$ mkdir weatherCLI
$ cd weatherCLI
$ npm init -y
```

This will create an empty directory called `weatherCLI` that will hold all our project files.

After our project directory has been created, we change the directory to the project directory and initialize our project. A `package.json` file will be created and now we can proceed to install our project dependencies:

```zsh
$ npm install commander node-fetch --save
```

`Commander` is a Node.js library that makes writing command line applications easy. We’ll be leveraging the library to build our command line application. `node-fetch` is also a light-weight module that allows us make requests to external services to fetch data. We’ll use it to fetch weather data from [`APIXU`](https://www.apixu.com/).

## Obtaining the API keys

To obtain our API keys, we need an account on `APIXU`. Once you’ve created an account, login to the dashboard to find your API key that looks like `4a8****3e``*e248ac1*****``04`.

## Building the command line app

First, let’s create our project files. Create a `src` directory, and within it, create two files:

```zsh
$ touch src/index.js src/commands.js
```

Once the files are created, we’ll go ahead to create our commands for the app by adding the code below inside `src/commands.js`:

```js
// src/commands.js
    
const fetch = require("node-fetch");
const APIXU_KEY = "<YOUR APIXU KEY>";
```

We import the `node-fetch` library, then we create an `APIXU_KEY` variable, which holds our API key.

Next, we’ll go ahead to create two functions: `fetchNow()` to fetch the current weather for any specified city and `weatherForecast()` to fetch the forecast of any specified city likewise:

```js
// src/commands.js

const fetchNow = async (city) => {
    const response = await fetch(`https://api.apixu.com/v1/current.json?key=${APIXU_KEY}&q=${city}`);
    const data = await response.json();

    const now = {
        location: data.location.name,
        country: data.location.country,
        longitude: data.location.lon,
        latitude: data.location.lat,
        temparature: data.current.temp_c,
        condition: data.current.condition.text
    };

    console.log(now);
};  
```

The `fetchNow` function is an asynchronous function that will return a `Promise`. It takes the passed `city` as a parameter in order to make the complete API request. The `await` operator can only be used inside an asynchronous function and it returns the fulfilled value of the `Promise`, or the value itself if it’s not a `Promise`.

The `now` object holds just the necessary information we need from the data returned from the API request. The same thing applies to the `weatherForecast` function:

```js
// src/commands.js
    
const weatherForecast = async (city) => {
    const response = await fetch(`https://api.apixu.com/v1/forecast.json?key=${APIXU_KEY}&q=${city}`);

    const data = await response.json();

    console.log(data.forecast)
};
```

After defining all functions, we need to export them so they can be used in our command line program:

```js
// src/commands.js
    
module.exports = {
    fetchNow,
    weatherForecast
};
```

Our main application file `src/index.js` will hold the main application logic. Add the code below inside `src/index.js`:

```js
// src/index.js
    
const program = require('commander');
const { fetchNow, weatherForecast } = require('./commands');
```

We import the `commander` library and also the defined functions from `src/commands.js`. After the dependencies have been imported, we’ll define our program parameters:

```js
// src/index.js

program
    .version('0.0.1')
    .description('Command line Weather Application')

program
    .command("now <city>")
    .alias('n')
    .description('see the current weather in the specified city')
    .action(city => fetchNow(city));

program
    .command("forecast <city>")
    .alias('f')
    .description('see the weather forcast of a specified city')
    .action(city => weatherForecast(city)); 
```

Let’s go over what each piece of the code above does:

* `.version` allows us to define the current version of our command line application

* `.command` defines how the parameter should be passed to the program w/ any extra arguments

* `.alias` defines an alternative short form parameter that can be passed to the program instead of typing a longer one.

* `description` is the description of the alias

* `.action` will call whatever function is passed to it. The action runs the functions and displays whatever is returned from the function. The action is also responsible for handling interactions with the user if the command line application is an interactive application.

In order to read all parameters and arguments passed to our program, we have to parse the inputs after the program command. Add the snippet below as the last line inside weatherCLI.js:

```js
// src/index.js
    
program.parse(process.argv)
```

## Running and testing the CLI application

To run and test our application, run the command below:

```zsh
$ node src/index.js now lagos
```

It will return the current weather in Lagos as below:

```zsh
→ weatherCLI node src/index.js now lagos
{ location: 'Lagos',
  country: 'Nigeria',
  longitude: 3.4,
  latitude: 6.45
  temperature: 31,
  condition: 'Partly cloudy' }
```

To fetch the weather forecast for Lagos, run:

```zsh
$ node src/index.js f lagos
```

```zsh
→ weatherCLI node src/index.js f lagos
{ forecastday:
  [ { date: '2019-04-13',
      date_epoch: 1555113600,
      day: [Object],
      astro: [Object] } ] }
```

Also, we can run additional commands as below:

```
$ node src/index.js --help
```

This will return the application usage menu.

```zsh
→ weatherCLI node src/index.js --help
Usage: index [options] [command]

Command line weather application

Options:
  -V, --version         output the version number
  -h, --help            output usage information

Commands:
  now | n <city>        see the current weather in the specified city
  forecast | n <city>   see the weather forecast of a specified city
```

```
$ node src/index.js --version
```

This will return the application version as specified earlier in `src/index.js`.
