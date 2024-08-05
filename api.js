const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database/db');

const PORT = process.env.PORT || 5555;
let sql;

const generateToken = require('./helpers/generateToken');
const validateQuery = require('./helpers/validateQuery');

const products = require('./routes/products');
const category = require('./routes/category');
const cart = require('./routes/cart');
const checkout = require('./routes/checkout');

app.use(express.static('public'));

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

app.get('/api/users/accessToken', (req, res) => {
  generateToken(req, res);
});

app.use((req, res, next) => {
  if (
    req.path.endsWith('/api/users/accessToken') ||
    req.path.includes('/images/')
  ) {
    next();
  }

  if (req.headers.authorization) {
    validateQuery(req, res, next);
  } else {
    return res.status(401).send('Нет доступа');
  }
});

app.use('/api/products', products);
app.use('/api/productCategory', category);
app.use('/api/cart', cart);
app.use('/api/checkout', checkout);

app.get('/', (req, res) => {
  res.send('Asilbek`s donuts REST API');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен по порту ${PORT}`);
});
