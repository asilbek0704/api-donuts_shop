const express = require('express');
const router = express.Router();
const db = require('../database/db.js');
const getTokenId = require('../helpers/getTokenId.js');

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

router.get('/:id', async (req, res) => {
  let sql;
  const { id } = req.params;
  const token = req.headers['authorization'].split(' ')[1];

  const tokenId = await getTokenId(token);

  if (!id) {
    return res.status(400).send('Не переданы параметры');
  }

  if (await tokenId) {
    sql = db.prepare(
      'SELECT products.id, name, category, price, image, time, hints, quantity FROM products INNER JOIN cart ON products.id = cart.productId WHERE products.id = ?'
    );

    sql.get(id, (err, product) => {
      if (err) {
        return res.status(500).send('Ошибка сервера');
      }

      if (!product) {
        return res.status(404).send('Продукт не найден');
      }

      return res.json(product);
    });
  } else {
    res.status(403).send('Нет доступа');
  }
});

module.exports = router;
