class WithoutExtensionError extends Error {
  constructor(message = "Add the file extension") {
    super(message);
  }
}

class ExtensionNotSupportedError extends Error {
  constructor(
    message = "This file extension is not supported. Only .json or .csv"
  ) {
    super(message);
  }
}
class FileNotFoundError extends Error {
  constructor(message = "File not found") {
    super(message);
  }
}

class FileIsEmptyError extends Error {
  constructor(message = "This file is empty") {
    super(message);
  }
}

module.exports = {
  WithoutExtensionError,
  ExtensionNotSupportedError,
  FileNotFoundError,
  FileIsEmptyError,
};
