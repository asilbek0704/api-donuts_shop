const express = require('express');
const router = express.Router();
const fs = require('fs');

const PRODUCTS = JSON.parse(fs.readFileSync('./products.json', 'utf8') || '[]');

router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    const search = req.query.q || req.query.search;

    if (category) {
      const products = PRODUCTS.filter(item => item.category === category);

      if (!products.length) {
        return res.status(404).send('Продукт не найден');
      }

      return res.json(products);
    }

    if (search) {
      const products = PRODUCTS.filter(item => {
        const itemName = item.name.toLowerCase();
        const searchName = search.trim().toLowerCase();

        return itemName.includes(searchName);
      });

      if (!products.length) {
        return res.status(404).send('Продукт не найден');
      }

      return res.json(products);
    }

    res.json(PRODUCTS);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const product = PRODUCTS.find(item => item.id == id);

      if (!product) {
        return res.status(404).send('Продукт не найден');
      }

      res.json(product);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
