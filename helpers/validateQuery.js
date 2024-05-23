const checkAuthToken = require('./checkAuthToken');
const updateTime = require('./updateTime');

const validateQuery = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Нет доступа');
  }

  const token = authHeader.split(' ')[1];
  const isValidToken = await checkAuthToken(token);

  if (!isValidToken) {
    return res.status(401).send('В доступе отказано');
  } else {
    await updateTime(token);
  }

  next();
};

module.exports = validateQuery;

