const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const promise = require("bluebird");
const taskQueries = require("../db/queries/tasks");
const userQueries = require("../db/queries/users");

const initOptions = {
  promiseLib: promise,
};

const db = require("../db/connection");

// Helper function to generate random string
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

// Registration Page
router.get("/register", (req, res) => {
  const userID = req.session.user_id;
  userQueries.getUsername(userID).then(({ username }) => {
    res.render("register", { username, user: userID });
  });
});

// Creating a new user
router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const username = req.body.username;
  if (!email || !password) {
    res.status(400).send("Please provide both a valid email and password");
  } else {
    db.query("SELECT * FROM users WHERE email = $1", [email])
      .then((results) => {
        if (results.rows.length > 0) {
          res.status(400).send("This account already exists");
        } else {
          db.query(
            "INSERT INTO users(username, password, email) VALUES($1, $2, $3) RETURNING id",
            [username, password, email]
          )
            .then((response) => {
              req.session.user_id = response.rows[0].id;
              res.redirect("/"); // Redirect to user's profile
            })
            .catch((error) => {
              // handle error
              console.log(error);
            });
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }
});

// render login page
router.get("/login", (req, res) => {
  const userID = req.session.user_id;
  userQueries.getUsername(userID).then(({ username }) => {
    res.render("login", { username, user: userID });
  });
});

// post login page
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Look up the user by email
  db.query("SELECT * FROM users WHERE email = $1", [email])
    .then((results) => {
      if (results.rows.length <= 0) {
        return res.status(400).send("Email account does not exist");
      }
      const user = results.rows[0];
      // Check to see if the user exists and if the password matches
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(403).send("Invalid email or password.");
      }

      // Set the user_id cookie with the matching user's ID
      req.session.user_id = results.rows[0].id;

      // Redirect to user's profile
      res.redirect("/");
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
});

// Logout
router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// render index page with logged in users tasks
router.get("/", (req, res) => {
  const userID = req.session.user_id;
  taskQueries
    .getAllTasks(userID)
    .then(({ allTasks, username }) => {
      res.render("index", {
        allTasks,
        user: userID,
        username,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
