const fs = require('fs').promises;

const checkAuthToken = async token => {
  try {
    const data = await fs.readFile('./data/tokens.json', 'utf8');
    const TOKENS = JSON.parse(data || '[]');
    return TOKENS.some(item => item.token === token);
  } catch (error) {
    console.error('Error reading or parsing tokens.json:', error);
    return false;
  }
};

module.exports = checkAuthToken;
