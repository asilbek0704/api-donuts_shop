const express = require('express');
const router = express.Router();
const db = require('../database/db.js');

router.get('/', (_, res) => {
  let sql = db.prepare('SELECT * FROM categories');
  sql.all((err, categories) => {
    if (err) {
      return res.status(500).send('Ошибка сервера');
    }

    return res.json(categories);
  });
});

module.exports = router;
