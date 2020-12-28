// This creates a new Express server:
const express = require("express");
const app = express();

// On the line after the one where you instantiated [ app ], import your key by
// typing const db = require('./config/keys').mongoURI;
const db = require('./config/keys').mongoURI;

// Import Mongoose
const mongoose = require('mongoose');

/* Import body parser to [ app.js ] so that we can parse the JSON we send to
to our frontend / Tells our app what sorts of requests app should respond to: */
const bodyParser = require('body-parser');

// Import routes
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

// const User = require('./models/User');

const passport = require('passport');

const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}

// Connect MongoDB using Mongoose:
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true }) // returns a promise
  .then(() => console.log("Connected to MongoDB successfully")) // notifies us of connection
  .catch(err => console.log(err)); // notifies us if it fails

// Sets up a basic route so that we can render some information on our page.
app.get("/", (req, res) => {
    // debugger;

    // const user = new User({
    //     handle: "jim",
    //     email: "jim@jim.jim",
    //     password: "jimisgreat123"
    // });

    // user.save();
    res.send("Carpe Diem!");
});

// Add the middleware for Passport:
app.use(passport.initialize());
// Need to setup a configuration file for Passport
require('./config/passport')(passport);

// We'll also need to setup some middleware for body parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Tell Express to use your newly imported routes
app.use("/api/users", users);
app.use("/api/tweets", tweets);

// Before we can run the server, we need to tell our app which port to run on.
// Keeping in mind that we will later be deploying our app to Heroku, which
// requires us to run our server on [ process.env.PORT ], add the following line
// to app.js:
const port = process.env.PORT || 5000;
// Locally our server will now run on [ localhost:5000 ].

// Finally, let's tell Express to start a socket and listen for connections on 
// the path. Do so by adding the following line to your file:
app.listen(port, () => console.log(`Server is running on port ${port}`));
// This will also log a success message to the console when our server is 
// running successfully.
