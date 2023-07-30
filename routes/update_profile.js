const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getUserById, checkAllEmails } = require("../db/queries/users");

//Updates user input on the database

module.exports = (db) => {
  router.post("/", async (req, res) => {
    const user = await getUserById(req.session.user_id);
    const emails = await checkAllEmails(req.session.user_id);

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.json({ error: "Password does not match" });
    } else if (emails.includes(req.body.email)) {
      res.json({ error: "Email already exists" });
    } else {
      let queryParams = [req.body.name, req.body.email];
      let queryString = `UPDATE users
          SET name = $1, email = $3`;

      if (req.body.new_password) {
        //If a new password (req.body.new_password) is provided, it hashes the password using bcrypt.hashSync() with a salt factor of 10 and pushes the hashed password to the queryParams array

        let password = bcrypt.hashSync(req.body.new_password, 10);
        queryParams.push(password);
        queryString += ` , password = $${queryParams.length}`;
      }

      queryParams.push(req.session.user_id);
      queryString += ` WHERE id = $${queryParams.length}
          RETURNING *;`;

      try {
        await db.query(queryString, queryParams);
        res.redirect("/items");
      } catch (err) {
        console.error("query error", err.stack);
      }
    }
  });

  return router;
};
