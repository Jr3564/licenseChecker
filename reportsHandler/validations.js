const fs = require("fs");
const reader = require("../fileHandler/reader");
const errors = require("./validationErros");

const isAValidExtension = (filePath, extensions) => {
  const filePathExtension = filePath.split(".").pop();
  if (!filePathExtension) {
    throw new errors.WithoutExtensionError(`Add the file extension.\npath error: ${filePath}`);
  } else if (extensions.includes(filePathExtension.toLowerCase())) {
    return true;
  }

  throw new errors.ExtensionNotSupportedError(
    `This file extension is not supported. Only ${extensions.join(" or ")}.\npath error: ${filePath}`
  );
};

const fileExists = (filePath) => {
  const fileExists = fs.existsSync(filePath);
  if (!fileExists) throw new errors.FileNotFoundError(`File not found.\npath error: ${filePath}`);
  return fileExists;
};

const fileIsNotEmpty = async (filePath) => {
  const file = await reader(filePath);
  if (!file.length) {
    throw new errors.FileIsEmptyError(`This file is empty.\npath error: ${filePath}`);
  }
};

const typedExit = (filePath) => {
  if (filePath === "exit") {
    console.log("\nOperation canceled by user");
    process.exit(1);
  }
};


exports.validToManyRead = async (stringFilePath, extensions) => {
  typedExit(stringFilePath);

  try {
    const filePaths = stringFilePath.split(",");

    for (let i = 0; i < filePaths.length; i++) {
      isAValidExtension(filePaths[i].trim(), extensions);
      await fileExists(filePaths[i].trim());
      await fileIsNotEmpty(filePaths[i].trim());
    }
  } catch ({ message }) {
    return message;
  }

  return true;
};

exports.validToRead = async (filePath, extensions) => {
  typedExit(filePath);

  try {
    isAValidExtension(filePath, extensions);
    fileExists(filePath);
    await fileIsNotEmpty(filePath);
  } catch ({ message }) {
    return message;
  }

  return true;
};


exports.validToWrite = async (filePath, extensions = ["csv", "json"]) => {
  typedExit(filePath);

  try {
    isAValidExtension(filePath, extensions);
  } catch ({ message }) {
    return message;
  }

  return true;
};
