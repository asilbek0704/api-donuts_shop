const express = require('express');
const router = express.Router();
const db = require('../database/db.js');
const getTokenId = require('../helpers/getTokenId.js');

router.post('/products', async (req, res) => {
  const { productId, quantity } = req.body;
  const token = req.headers['authorization'].split(' ')[1];

  if (!productId || !quantity) {
    return res.status(400).send('Не переданы параметры');
  }

  const tokenId = await getTokenId(token);

  if (await tokenId) {
    sql = db.prepare(
      'INSERT INTO cart (tokenId, productId, quantity) VALUES (?, ?, ?)'
    );

    sql.run(tokenId, productId, quantity);

    res.json({
      message: 'Товар успешно добавлен в корзину',
      productId,
      quantity,
    });
  } else {
    res.status(403).send('Нет доступа');
  }
});

router.delete('/products/:id', async (req, res) => {
  let sql;
  const token = req.headers['authorization'].split(' ')[1];
  const productId = Number(req.params.id);

  if (!productId) {
    return res.status(400).send('Не переданы параметры');
  }

  const tokenId = await getTokenId(token);
  console.log('TOKEN ID: ', tokenId);

  if (await tokenId) {
    sql = db.prepare('DELETE FROM cart WHERE tokenId = ? AND productId = ?');

    sql.run(tokenId, productId);

    res.json({
      message: 'Товар успешно удален из корзины',
      productId,
    });
  } else {
    res.status(403).send('Нет доступа');
  }
});

router.get('/', async (req, res) => {
  let sql;
  const token = req.headers['authorization'].split(' ')[1];

  const tokenId = await getTokenId(token);

  if (await tokenId) {
    sql = db.prepare(
      'SELECT productId, quantity, name, category, price, image, time, hints FROM cart INNER JOIN products ON cart.productId = products.id WHERE tokenId = ?'
    );

    sql.all(tokenId, (err, products) => {
      if (err) {
        return res.status(500).send('Ошибка сервера');
      }

      if (!products.length) {
        return res.status(200).json({
          products: [],
          totalCount: 0,
          totalPrice: 0,
        });
      }

      const totalCount = products.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      return res.json({
        products,
        totalCount: totalCount,
        totalPrice: Number(totalPrice.toFixed(2)),
      });
    });
  } else {
    res.status(403).send('Нет доступа');
  }
});

module.exports = router;
