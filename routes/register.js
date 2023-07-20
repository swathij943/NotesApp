const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


module.exports = () => {
  // register GET
  router.get('/', (req, res) => {
    res.redirect('/login');
  });

  // register POST
  router.post('/', async (req, res) => {
    const input = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    // Check if a user with the same email already exists in the database
    const user = await getUserByEmail(input.email);

    if (user) {
      // If a user with the email already exists, redirect to the login page
      res.redirect('/login');
    } else {
      // If the email is not registered, add the user to the database
      const addingUser = await addUser(input);

      // Set up a new session with the user_id of the registered user
      req.session = { user_id: addingUser.id };

      // Redirect the user to the '/tasks' page (assuming this is the page after successful registration)
      res.redirect('/todo');
    }
  });

  return router;
};
