const fs = require("fs");
const reader = require("../fileHandler/reader");
const errors = require("./reportValidationErros");

const isAValidExtension = (filePath, extensions) => {
  const [, filePathExtension] = filePath.split(".");

  if (!filePathExtension) {
    throw new errors.WithoutExtensionError();
  } else if (extensions.includes(filePathExtension.toLowerCase())) {
    return true;
  }

  throw new errors.ExtensionNotSupportedError();
};

const fileExists = (filePath) => {
  const fileExists = fs.existsSync(filePath);
  if (!fileExists) throw new errors.FileNotFoundError();
  return fileExists;
};

const fileIsNotEmpty = async (filePath) => {
  const file = await reader(filePath);
  if (!file.length) {
    throw new errors.FileIsEmptyError();
  }
};

const typedExit = (filePath) => {
  if (filePath === "exit") {
    console.log("\nOperation canceled by user");
    process.exit(1);
  }
};

exports.validToRead = async (filePath) => {
  typedExit(filePath);

  try {
    isAValidExtension(filePath, ["csv", "json"]);
    fileExists(filePath);
    await fileIsNotEmpty(filePath);
  } catch ({ message }) {
    return message;
  }

  return true;
};

exports.validToWrite = async (filePath) => {
  typedExit(filePath);

  try {
    isAValidExtension(filePath, ["csv", "json"]);
  } catch ({ message }) {
    return message;
  }

  return true;
};
