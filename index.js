const reader = require("./fileHandler/reader");
const reportsinterface = require("./reportsHandler/interface");
const { csvToObject, jsonToObject } = require("./fileHandler/converter");
const { validToRead: validate } = require("./reportsHandler/reportValidation");
const { prompt } = require("inquirer");

(() => {
  const questions = [
    {
      type: "input",
      name: "filePath",
      message: "Type 'exit' to cancel.\n" + "Analyze file ./",
      validate,
      filter: (answer) => answer.trim(),
    },
  ];

  prompt(questions).then(async ({ filePath }) => {
    const ifError = (err) => console.error(err);
    const licensesInputed = await reader(filePath, ifError);

    const licenses = filePath.includes(".csv")
      ? csvToObject(licensesInputed)
      : jsonToObject(licensesInputed);

    reportsinterface(licenses);
  });
})();
