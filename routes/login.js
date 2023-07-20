const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


module.exports = () => {

  router.get('/', (req, res) => {
    //to check if user is logged in

    if (req.session.user_id) {
      res.redirect('/todo');

    } else {
      let templateVars = {
        user: {id: undefined, name: null}
      };
      res.render('../views/login', templateVars);
    }
  });

  //for logging in

  router.post('/', async (req, res) => {
    getUserByEmail(req.body.email)
      .then(user => {
        //check if the user exists

        if (!user) {
          res.json({error: 'User does not exist'});

        } else {
          //check if the provided password matches the user's stored password
          if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.json({error: 'Password does not match'});

          } else {
            // Set the user_id in the session and redirect to the '/todo' path
            req.session = { user_id: user.id };
            res.redirect('/todo');

          }
        }
      })
      .catch(err => {
        console.error('login error', err);
      });

  });

  //login after registering

return router;
}
