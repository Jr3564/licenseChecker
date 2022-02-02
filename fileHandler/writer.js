const fs = require("fs").promises;

module.exports = (text, filePath, errorCallback) => {
  return fs.writeFile(filePath, text, { flag: "w" }, errorCallback);
};
