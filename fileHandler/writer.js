const fs = require("fs").promises;

const defaultCallback = (err) => {
  console.log(err);
};
module.exports = (text, filePath, errorCallback = defaultCallback) => {
  return fs.writeFile(filePath, text, { flag: "w" }, errorCallback);
};
