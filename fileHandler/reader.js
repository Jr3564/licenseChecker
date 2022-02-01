const fileSystem = require("fs").promises;

module.exports = (fileName, errorCallback) =>
  fileSystem.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      errorCallback(err);
      process.exit(1);
    }
    return data;
  });

// TODO: Use lazy loading
/* async function formaterObjectsLazy(jsonList) {
  for (const element of ) {
    console.log(element);
    yield element;
  }
} */
