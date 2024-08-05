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

    sql = db.prepare('SELECT * FROM products WHERE id = ?');

    sql.get(productId, (_, product) => {
      sql = db.prepare(
        'SELECT * FROM cart WHERE productId = ? AND tokenId = ?'
      );

      sql.get([productId, tokenId], (_, cartProduct) => {
        product.hints = product?.hints?.split(', ');

        if (!cartProduct) {
          product.quantity = 1;
        } else {
          product.quantity = cartProduct.quantity;
        }

        const {
          id: productId,
          name,
          category,
          price,
          image,
          time,
          hints,
          quantity,
        } = product;

        return res.json({
          product: {
            productId,
            quantity,
            name,
            category,
            price,
            image,
            time,
            hints,
          },
          message: 'Товар успешно добавлен в корзину',
        });
      });
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

  if (await tokenId) {
    sql = db.prepare('DELETE FROM cart WHERE tokenId = ? AND productId = ?');

    sql.run(tokenId, productId, () => {
      sql = db.prepare('SELECT * FROM products WHERE id = ?');

      sql.get(productId, (_, product) => {
        product.hints = product?.hints?.split(', ');

        return res.json({
          message: 'Товар успешно удален из корзины',
          product,
        });
      });
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
