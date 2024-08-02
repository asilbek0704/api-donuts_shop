const express = require('express');
const router = express.Router();
const db = require('../database/db.js');

router.get('/', (req, res) => {
  const { category, list } = req.query;
  const search = req.query.q || req.query.search;

  let sqlCmd = 'SELECT * FROM products';

  if (list) {
    sqlCmd = `SELECT * FROM products WHERE id IN (${list})`;
  } else if (category) {
    sqlCmd = `SELECT * FROM products WHERE category = "${category}"`;
  } else if (search) {
    const pattern = '%' + search + '%';
    sqlCmd = `SELECT * FROM products WHERE name LIKE "${pattern}"`;
  }

  db.all(sqlCmd, (err, products) => {
    if (err) {
      return res.status(500).send('Ошибка сервера');
    }

    if (!products.length) {
      return res.status(404).send('Продукт не найден');
    }

    return res.json(products);
  });
});

module.exports = router;
