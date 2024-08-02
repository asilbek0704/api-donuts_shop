const db = require('../database/db.js');

const checkAuthToken = token => {
  const row = db.prepare('SELECT * FROM tokens WHERE token = ?').get(token);
  return row !== undefined;
};

module.exports = checkAuthToken;