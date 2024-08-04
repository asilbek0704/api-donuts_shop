const db = require('../database/db.js');

const getTokenId = token => {
  let sql;
  return new Promise((resolve, reject) => {
    sql = db.prepare('SELECT id FROM tokens WHERE token = ?');
    sql.get(token, (err, tokenRow) => {
      if (err) {
        reject(err);
      }
      resolve(tokenRow.id);
    });
  });
};

module.exports = getTokenId;