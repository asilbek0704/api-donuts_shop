const db = require('../database/db.js');

const getProductPrice = productId => {
  return new Promise((resolve, reject) => {
    sql = db.prepare('SELECT price FROM products WHERE id = ?');

    sql.get(productId, (err, { price }) => {
      if (err) {
        reject('Ошибка сервера');
      }

      resolve(price);
    });
  });
};


module.exports = getProductPrice;