const express = require('express');
const cors = require('cors');
const app = express();

const products = require('./routes/products');
const category = require('./routes/category');
const cart = require('./routes/cart');

const validateQuery = require('./helpers/validateQuery');
const checkFile = require('./helpers/checkFile');
const generateToken = require('./helpers/generateToken');

const PORT = 5000;

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

checkFile('./data/tokens.json', '[]');
checkFile('./data/orders.json', '[]');


app.get('/api/users/accessToken', (req, res) => {
  generateToken(req, res);
});

app.use((req, res, next) => {
  if (!req.path.includes('/api/users') && req.headers.authorization) {
    validateQuery(req, res, next);
  } else {
    next();
  }
});


app.use('/api/products', products);
app.use('/api/productCategory', category);
// app.use('/api/cart', cart);

app.listen(PORT, () => {
  console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
