const fs = require('fs').promises;

const updateTime = async (token) => {
  try {
    const data = await fs.readFile('./data/tokens.json', 'utf8');
    const TOKENS = JSON.parse(data || '[]');

    const tokenIndex = TOKENS.findIndex(item => item.token === token);

    if (tokenIndex === -1) {
      console.error('Токен не найден');
      return;
    }

    TOKENS[tokenIndex].lastUsed = new Date().toLocaleString();

    await fs.writeFile('./data/tokens.json', JSON.stringify(TOKENS));
    console.log('Время использования токена успешно обновлено');
  } catch (err) {
    console.error('Ошибка при обновлении времени использования токена', err);
  }
};

module.exports = updateTime;
