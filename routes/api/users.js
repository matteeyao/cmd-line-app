const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

// Private auth route:
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    // res.json({msg: 'Success'});
    res.json({
        id: req.user.id,
        handle: req.user.handle,
        email: req.user.email
    });
})

// Setup a route to register new users:
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check to make sure nobody has already registered with a duplicate email
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            // Throw a 400 error if the email address already exists
            // return res.status(400).json({email: "A user has already registered with this address"})

            // Use the validations to send the error
            errors.handle = "User already exists";
            return res.status(400).json(errors)
        } else {
            // Otherwise create a new user
            const newUser = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            })

            /* Store the user w/ a salted and encrypted password hash. Let's use bcrypt
            to salt and hash out new user's password before storing it in the database
            and saving the user */
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            const payload = { id: user.id, handle: user.handle };

                            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            });
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// Setup a route to allow our users to login:
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        if (!user) {
            // return res.status(404).json({email: 'This user does not exist'});

            // Use the validations to send the error
            errors.handle = "This user does not exist";
            return res.status(400).json(errors);
        }

        /* Compares the user inputted password w/ the salted and hashed password
        in the database. If the password is incorrect, it will return a status
        400 error. */
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // res.json({ msg: "Success!" });
                /* Instead of giving a success message, let's give the client
                back a JSON web token that they can use for future requests for
                authentication */
                const payload = {
                    id: user.id, 
                    handle: user.handle,
                    email: user.email
                };
                jwt.sign(
                    payload, 
                    keys.secretOrKey,
                    // Tell the key to expire in one hour
                    {expiresIn: 3600},
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else {
                // errors.password = "Incorrect password";
                // return res.status(400).json(errors);
                return res.status(400).json({password: 'Incorrect password'});
            }
        });
    });
});

module.exports = router;

/* We want to return a signed web token w/ each [ login ] or [ register ]
request in order to "sign the user in" on the frontend. */