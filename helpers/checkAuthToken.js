const db = require('../database/db.js');

const checkAuthToken = token => {
  let sql;
  return new Promise((resolve, reject) => {
    sql = db.prepare('SELECT * FROM tokens WHERE token = ?');

    sql.get(token, (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

module.exports = checkAuthToken;
