const reader = require("./fileHandler/reader");
const reportsinterface = require("./reportsHandler/interface");
const { csvToObject, jsonToObject } = require("./fileHandler/converter");
const { prompt } = require("inquirer");
const fs = require("fs");
// data/extracted_license.json
// data/extracted_license.csv

(() => {
  const questions = [
    {
      type: "input",
      name: "filePath",
      message: "Analyze file ./",
      async validate(fileName) {
        // TODO: Improve this logic
        if (!fileName?.includes(".json") && !fileName?.includes(".csv"))
          return "Add file extension";
        return fs.existsSync(fileName) || `File "${fileName}" not found`;
      },
      filter: (answer) => answer.trim(),
    },
  ];

  prompt(questions).then(async ({ filePath }) => {
    const licensesInputed = await reader(filePath, (err) => {
      console.log(err);
    });

    const licenses = filePath.includes(".csv")
      ? csvToObject(licensesInputed)
      : jsonToObject(licensesInputed);

    reportsinterface(licenses);
  });
})();
