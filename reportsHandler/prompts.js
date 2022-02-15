const { validToWrite, validToRead, validToManyRead } = require("./validations");
const { prompt } = require("inquirer");

exports.typeLicensePrompt = (types, callback) => {
  const question = [
    {
      type: "list",
      name: "type",
      message: "What license type?",
      choices: types,
    },
  ];

  prompt(question).then(({ type }) => {
    callback(type);
  });
};

exports.typeFilePathToExportionPrompt = (extensions, callback) => {
  const question = {
    type: "input",
    name: "filePath",
    message: "If the file exists it will be replaced\n" + "Export file to ./",
    validate: (filePath) => validToWrite(filePath, extensions),
    filter: (answer) => answer.trim(),
  };

  prompt([question]).then(({ filePath }) => {
    callback(filePath);
  });
};

exports.typeFilePathToReadingPrompt = (extensions, callback) => {
  const questions = [
    {
      type: "input",
      name: "filePath",
      message: "Type 'exit' to cancel.\n" + "Analyze file ./",
      validate: (filePath) => validToRead(filePath, extensions),
      filter: (answer) => answer.trim(),
    },
  ];

  prompt(questions).then(({ filePath }) => {
    callback(filePath);
  });
};

exports.choiceOneOptionPrompt = (choices, callback) => {
  const questions = [
    {
      type: "list",
      name: "choice",
      message: "What do you want to do?",
      choices: [...Object.values(choices)],
    },
  ];

  prompt(questions).then(async ({ choice }) => {
    callback(choice);
  });
};

exports.choiceToSaveBooleanOptionPrompt = (callback) => {
  const questions = [
    {
      type: "confirm",
      name: "doSave",
      message: "Do you want to save?",
      default: false,
    },
  ];

  prompt(questions).then(({ doSave }) => {
    callback(doSave);
  });
};

// TODO:REPEATS
const addPackageJsonIn = (path) => {
  const PACKAGEJSON = 'package.json';
  if (path.includes(PACKAGEJSON)) return path
  return path[path.length - 1] === '/' ? `${path}${PACKAGEJSON}`: `${path}/${PACKAGEJSON}`;
}

exports.typeManyFilePathToPackageJsonReadingPrompt = (callback) => {
  const questions = [
    {
      type: "input",
      name: "filePath",
      message: "Type 'exit' to cancel.\n" + "add ',' to each file path\n" + "Analyze file ./",
      validate: validToManyRead,
      filter: (answer) => answer.trim(),
      default: ''
    },
  ];

  prompt(questions).then(({ filePath }) => {
    const filePaths = filePath.split(",").map(path => {
     return addPackageJsonIn('./' + path.trim())
    });
    callback(filePaths);
  });
};
