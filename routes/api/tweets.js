const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Tweet = require('../../models/Tweet');
const validateTweetInput = require('../../validation/tweets');

// route to retrieve all tweets (index route)
router.get('/', (req, res) => {
    Tweet
        .find()
        .sort({ date: -1 })
        .then(tweets => res.json(tweets))
        .catch(err => res.status(404).json({ notweetsfound: 'No tweets found' }));
});

// route to retrieve a single user's tweets
router.get('/user/:user_id', (req, res) => {
    Tweet.find({user: req.params.user_id})
        .then(tweets => res.json(tweets))
        .catch(err =>
            res.status(404).json({ notweetsfound: 'No tweets found from that user' }
        )
    );
});

// route to retrieve individual tweets
router.get('/:id', (req, res) => {
    Tweet
        .findById(req.params.id)
        .then(tweet => res.json(tweet))
        .catch(err =>
            res.status(404).json({ notweetfound: 'No tweet found with that ID' })
        );
});

// Finally, we will create a protected route for a user to post tweets:
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { errors, isValid } = validateTweetInput(req.body);
  
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      const newTweet = new Tweet({
        text: req.body.text,
        user: req.user.id
      });
  
      newTweet.save().then(tweet => res.json(tweet));
    }
  );

module.exports = router;

/* If this were a real app, we would want to create an authenticated route to 
delete tweets, and perhaps some additional routes to add comments or likes. 
However, for the sake of this tutorial, we are going to keep things simple and 
stick with the ability to retrieve and create tweets. */

/* Use Postman to test your new routes */