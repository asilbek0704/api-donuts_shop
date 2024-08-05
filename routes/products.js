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
    sql = db.prepare('SELECT * FROM products WHERE id = ?');

    sql.get(id, (_, product) => {
      sql = db.prepare(
        'SELECT * FROM cart WHERE productId = ? AND tokenId = ?'
      );

      sql.get([id, tokenId], (_, cartProduct) => {
        product.hints = product?.hints?.split(', ');

        if (!cartProduct) {
          product.quantity = 1;
        } else {
          product.quantity = cartProduct.quantity;
        }

        return res.json(product);
      });
    });
  } else {
    res.status(403).send('Нет доступа');
  }
});

module.exports = router;
