const fs = require("fs").promises;
const { objectToCSV } = require("../fileHandler/converter");

const defaultCallback = (err) => {
  console.log(err);
};

const write = (data, filePath, errorCallback = defaultCallback) => {
  return fs.writeFile(filePath, data, { flag: "w" }, errorCallback);
};

const convertAndWrite = (data, filePath, errorCallback) => {
  const convertedDependencies = filePath.includes(".csv")
    ? objectToCSV(data)
    : JSON.stringify(data, "", 2);

  return writer(convertedDependencies, filePath, errorCallback);
};

module.exports = { write, convertAndWrite };
