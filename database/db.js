const Database = require('better-sqlite3');
const db = new Database('donuts-shop.db');

module.exports = db;