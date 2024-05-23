const fs = require('fs').promises;

const generateToken = async (req, res) => {
  const accessKey =
    Math.random().toString(36).substring(3) + Date.now().toString(36);

  try {
    const file = await fs.readFile('./data/tokens.json', 'utf8');
    const TOKENS = JSON.parse(file || '[]');
    const lastId = TOKENS.length ? TOKENS[TOKENS.length - 1].id : 0;

    const newUser = {
      id: lastId + 1,
      token: accessKey,
      createdAt: new Date().toLocaleString(),
      lastUsed: null,
    };

    TOKENS.push(newUser);
    await fs.writeFile('./data/tokens.json', JSON.stringify(TOKENS));


    console.log('New token generated:', accessKey); // Remove in production
    return res.json({ accessKey });
  } catch (error) {
    console.error('Error reading or parsing tokens.json:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = generateToken;
