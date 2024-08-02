const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('donuts-shop.db');

module.exports = db;