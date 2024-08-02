const db = require('../database/db.js');

const generateToken = async (req, res) => {
  const accessKey =
    Math.random().toString(36).substring(3) + Date.now().toString(36);

  let sql = db.prepare('INSERT INTO tokens (token) VALUES (?)');

  sql.run(accessKey, err => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    return res.json({ accessKey });
  });
};

module.exports = generateToken;
