// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const checkFile = require('../helpers/checkFile');

// checkFile('./data/cart.json', '[]');

// const CART = JSON.parse(fs.readFileSync('./data/cart.json', 'utf-8'));
// const TOKENS = JSON.parse(fs.readFileSync('./data/tokens.json', 'utf8') || "[]");
// const PRODUCTS = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || "[]");

// router.delete('/products/:id', (req, res) => {
//   const { id: productId } = req.params;
//   const token = req.headers['authorization'].split(' ')[1];

//   if (!productId) {
//     return res.status(400).send('Не переданы параметры');
//   }

//   const tokenId = TOKENS.find(item => item.token == token).id;

//   const cartItemIndex = CART.findIndex(item => item.tokenId == tokenId);

//   if (cartItemIndex === -1) {
//     return res.status(404).send('Товаров в корзине нет');
//   }

//   const updatedCart = CART[cartItemIndex].cart.filter(
//     item => item.productId != productId
//   );

//   CART[cartItemIndex].cart = updatedCart;

//   fs.writeFile('./data/cart.json', JSON.stringify(CART), err => {
//     if (err) {
//       console.error('Ошибка при удалении товара из корзины', err);
//       return res.send('Ошибка при удалении товара из корзины');
//     } else {
//       console.log('Товар успешно удален из корзины');
//       return res.json({ ok: true });
//     }
//   });

//   return;
// });

// router.post('/products', (req, res) => {
//   const { productId, quantity } = req.body;
//   const token = req.headers['authorization'].split(' ')[1];

//   if (!productId || !quantity) {
//     return res.status(400).send('Не переданы параметры');
//   }

//   const tokenId = TOKENS.find(item => item.token == token).id;

//   const cartItemIndex = CART.findIndex(item => item.tokenId == tokenId);

//   if (cartItemIndex === -1) {
//     CART.push({
//       id: CART[CART.length - 1].id + 1,
//       tokenId,
//       cart: [{ productId, quantity }],
//     });
//   } else {
//     CART[cartItemIndex].cart.push({ productId, quantity });
//   }

//   // Обновить количество товара если он уже есть в корзине

//   fs.writeFile('./data/cart.json', JSON.stringify(CART), err => {
//     if (err) {
//       console.error('Ошибка при добавлении товара в корзину', err);
//       return res.send('Ошибка при добавлении товара в корзину');
//     } else {
//       console.log('Товар успешно добавлен в корзину');
//       return res.send('Товар успешно добавлен в корзину');
//     }
//   });
// });

// // Display the cart
// router.get('/', (req, res) => {
//   const token = req.headers['authorization'].split(' ')[1];

//   const tokenId = TOKENS.find(item => item.token == token).id;
//   const cartItem = CART.find(item => item.tokenId == tokenId);

//   if (!cartItem) {
//     return res.status(404).send('Товаров в корзине нет');
//   }

//   const cartProducts = cartItem.cart.map(product => {
//     const productInfo = PRODUCTS.find(item => item.id == product.productId);

//     return {
//       ...productInfo,
//       quantity: product.quantity,
//     };
//   });

//   console.log(cartProducts)

//   const totalCount = cartProducts.reduce((acc, item) => acc + item.quantity, 0);

//   const totalPrice = cartProducts.reduce((acc, item) => {
//     return acc + (item.price * item.quantity);
//   }, 0); 

//   console.log(totalCount, totalPrice)

//   return res.json({
//     products: cartProducts,
//     totalCount,
//     totalPrice: +totalPrice.toFixed(2),
//   });

// });

// module.exports = router;
