const db = require("../connection");

const getprofileData = (email) => {
  return db
    .query(
      `SELECT * FROM users WHERE email = $1
       RETURNING *;`,
      [email]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = { getprofileData };
