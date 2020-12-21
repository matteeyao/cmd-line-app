// This creates a new Express server.
const express = require("express");
const app = express();

// On the line after the one where you instantiated [ app ], import your key by
// typing const db = require('./config/keys').mongoURI;
const db = require('./config/keys').mongoURI;

// Import Mongoose
const mongoose = require('mongoose');

// Connect MongoDB using Mongoose:
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// Sets up a basic route so that we can render some information on our page.
app.get("/", (req, res) => res.send("Carpe Diem"));

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

