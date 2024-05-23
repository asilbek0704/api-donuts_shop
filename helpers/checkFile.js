const fs = require('fs');

const checkFile = (path, initialState) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, initialState);
    console.log(`Файл ${path} успешно создан`);
  }
}

module.exports = checkFile;
