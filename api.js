const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database/db');

const PORT = process.env.PORT || 5555;
let sql;

const generateToken = require('./helpers/generateToken');
const validateQuery = require('./helpers/validateQuery');

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

/*db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY,
        tokenId INTEGER
      );
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_user_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    client TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    distribution TEXT,
    payment TEXT,
    comments TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    productId INTEGER,
    quantity INTEGER,
    FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);

  console.log('Tables created successfully!');
});
db.close();*/

app.get('/api/users/accessToken', (req, res) => {
  generateToken(req, res);
});

app.use((req, res, next) => {
  if (req.path.endsWith('/api/users/accessToken')) {
    next();
  }

  if (req.headers.authorization) {
    validateQuery(req, res, next);
  } else {
    return res.status(401).send('Нет доступа');
  }
});

app.use('/api/products', products);
// app.use('/api/productCategory', category);
// app.use('/api/cart', cart);
// app.use('/api/checkout', checkout);

app.get('/', (req, res) => {
  res.send('Asilbek`s donuts REST API');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен по порту ${PORT}`);
});
