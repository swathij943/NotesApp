const express = require('express');
const router = express.Router();

module.exports = () => {
  router.post('/', (req, res) => {
    // clear session cookie
    req.session = null;
    // redirect to login page
    res.redirect('/login');

  });

  return router;
}
