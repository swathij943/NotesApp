/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const profileQueries = require("../db/queries/profile");

router.get("/", (req, res) => {
  const userID = req.session.user_id;
  profileQueries
    .getuserProfile("user1@example.com")

    .then((result) => {
      console.log(result);

      let templateVars = {
        user: {
          id: result.user_id,
          name: result.username,
          password: result.password,
          email: result.email,
        },
      };

      res.render("profile", {
        templateVars,
        username: result,
        user: userID,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/", (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    profileQueries.updateuserProfile(username, email, password);

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
