const express = require('express');
const router = express.Router();
const fs = require('fs');

const CATEGORIES = JSON.parse(
  fs.readFileSync('./categories.json', 'utf8') || "[]"
);

router.get('/', (req, res) => {
  try {
    res.json(CATEGORIES);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
