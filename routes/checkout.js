const express = require('express');
const router = express.Router();
const db = require('../database/db.js');
const getTokenId = require('../helpers/getTokenId.js');
const getProductPrice = require('../helpers/getProductPrice.js');

router.get('/:orderId', async (req, res) => {
  let sql;
  const { orderId } = req.params;
  const token = req.headers['authorization'].split(' ')[1];

  const tokenId = await getTokenId(token);

  sql = db.prepare(
    'SELECT client, address, phone, email, distribution, payment, comments FROM orders WHERE id = ? AND tokenId = ?'
  );

  sql.get([orderId, tokenId], (_, order) => {
    if (!order) {
      return res.status(404).send('Заказ не найден');
    }

    sql = db.prepare('SELECT * FROM order_products WHERE orderId = ?');

    sql.all(orderId, async (err, products) => {
      if (err) {
        return res.status(500).send('Ошибка сервера');
      }

      let totalPrice = 0;
      let totalCount = 0;
      for (const product of products) {
        const price = await getProductPrice(product.productId);
        totalPrice += price * product.quantity;
        totalCount += product.quantity;
      }

      const orderData = {
        ...order,
        totalCount,
        totalPrice: Number(totalPrice.toFixed(2)),
      };

      return res.json(orderData);
    });
  });
});

router.post('/', async (req, res) => {
  let sql;
  const token = req.headers['authorization'].split(' ')[1];
  const tokenId = await getTokenId(token);

  const { client, address, phone, email, distribution, payment, comments } =
    req.body;

  if (!client || !phone || !distribution || !payment) {
    return res.status(400).send('Не переданы данные для оформления заказа');
  }

  if (await tokenId) {
    sql = db.prepare(
      'INSERT INTO orders (tokenId, client, address, phone, email, distribution, payment, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    sql.run(
      [tokenId, client, address, phone, email, distribution, payment, comments],
      function () {
        let orderId = this.lastID;

        sql = db.prepare('SELECT * FROM cart WHERE tokenId = ?');

        sql.all(tokenId, (err, products) => {
          if (err) {
            return res.status(500).send('Ошибка сервера');
          }

          if (!products.length) {
            return res.status(404).send('Корзина пуста');
          }

          sql = db.prepare(
            'INSERT INTO order_products (orderId, productId, quantity) VALUES (?, ?, ?)'
          );

          products.forEach(product => {
            sql.run([orderId, product.productId, product.quantity]);
          });

          sql = db.prepare('DELETE FROM cart WHERE tokenId = ?');
          sql.run(tokenId);

          return res.json({
            orderId: orderId,
            message: 'Новый заказ успешно добавлен',
          });
        });
      }
    );
  } else {
    res.status(403).send('Нет доступа');
  }
});

module.exports = router;
