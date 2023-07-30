//helper functions where the database is involved
const db  = require('../db/connection');
const bcrypt = require('bcrypt');

//addItem inserts a newly added item to the database with its category
const addItem = async function (obj) {
  const { items, item_id, category_id } = obj;

  const queryString = `
  INSERT INTO items (item_name, item_id, category_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;

  const values = [items, item_id, category_id];

  try {
    const res = await db.query(queryString, values);
    return res.rows[0];

  } catch (err) {
    console.error('query error', err.stack);

  }
}

const checkAllEmails = async function (user_id) {
  const queryString = `
  SELECT email
  FROM users
  WHERE id != ${user_id};
  `;
  try {
    const res = await db.query(queryString);
    const emails = []
    for (let each of res.rows){
      emails.push(each.email)
    }
    return emails;

  } catch (err) {
    console.error('query error', err.stack);

  }
}

const getUserByEmail = async (email) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE email = $1
  `;
  const queryParams = [email];

  try {
    const res = await db.query(queryString, queryParams);
    return res.rows[0] || null;

  } catch (err) {
    console.error('query error', err.stack);
  }

}

const getUserById = async (id) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE user_id = $1
  `;
  const queryParams = [id];

  try {
    const res = await db.query(queryString, queryParams);
    return res.rows[0];

  } catch (err) {
    console.error('query error', err.stack);
  }
}

const getItemById = async (id) => {
  const queryString = `
    SELECT item_id, item_name, category_id
    FROM items
    WHERE user_id = $1
  `;

  const queryParams = [id];

  try {
    const res = await db.query(queryString, queryParams);
    return res.rows;

  } catch (err) {
    console.error('query error', err.stack);

  }
}

const addUser = async (obj) => {
  const { name, email, password } = obj;

  const queryString = `
  INSERT INTO users (username, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

  const queryParams = [name, email, bcrypt.hashSync(password, 10)];

  try {
    const res = await db.query(queryString, queryParams);
    return res.rows[0];


  } catch (err) {
    console.error('query error', err.stack);

  }
}

module.exports = {
  addItem,
  checkAllEmails,
  getUserByEmail,
  getUserById,
  getItemById,
  addUser
};

