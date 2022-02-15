const fs = require("fs");
const reader = require("../fileHandler/reader");
const errors = require("./validationErros");

const isSupportedExtension = (filePath, extensions) => {
  const filePathExtension = filePath.split(".").pop();
  if (extensions.includes(filePathExtension.toLowerCase())) {
    return true;
  }
  throw new errors.ExtensionNotSupportedError(
    `This file extension is not supported. Only ${extensions.join(" or ")}.\npath error: ${filePath}`
  );
};

const isAValidExtension = (filePath) => {
  const filePathExtension = filePath.split(".").pop();
  if (filePathExtension) {
    return true;
  }
  throw new errors.WithoutExtensionError(`Add the file extension.\npath error: ${filePath}`);
};

const fileExists = (filePath) => {
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    return true;
  }
  throw new errors.FileNotFoundError(`File not found.\npath error: ${filePath}`);
};

const fileIsNotEmpty = async (filePath) => {
  const file = await reader(filePath);
  if (file.length) {
    return true;
  }
  throw new errors.FileIsEmptyError(`This file is empty.\npath error: ${filePath}`);
};

const typedExit = (filePath) => {
  if (filePath === "exit") {
    console.log("\nOperation canceled by user");
    process.exit(1);
  }
};

// TODO:REPEATS
const addPackageJsonInPath = (path) => {
  const PACKAGEJSON = 'package.json';
  if (path.includes(PACKAGEJSON)) return path
  return path[path.length - 1] === '/' ? `${path}${PACKAGEJSON}`: `${path}/${PACKAGEJSON}`;
}
const hasPackageJson = (path) => {
  const filePath = addPackageJsonInPath(path);
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    return true;
  }

  throw new errors.FileNotFoundError(
    `There is no package.json in this path.\npath error: ${filePath}`
  );
}

exports.validToManyRead = async (stringFilePath) => {
  typedExit(stringFilePath);
  try {
    const filePaths = stringFilePath.split(",");

    filePaths.forEach(path => {
      hasPackageJson('./' + path.trim());
    })
  } catch ({ message }) {
    return message;
  }

  return true;
};

exports.validToRead = async (filePath, extensions) => {
  typedExit(filePath);

  try {
    isAValidExtension(filePath);
    isSupportedExtension(filePath, extensions)
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
    isAValidExtension(filePath);
    isSupportedExtension(filePath, extensions)
  } catch ({ message }) {
    return message;
  }

  return true;
};
