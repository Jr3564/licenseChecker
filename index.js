const reader = require("./fileHandler/reader");
const reportsinterface = require("./reportsHandler/interface");
const { csvToObject, jsonToObject } = require("./fileHandler/converter");
const { prompt } = require("inquirer");
const fs = require("fs");

(() => {
  const questions = [
    {
      type: "input",
      name: "filePath",
      message: "Type 'exit' to cancel.\nAnalyze file ./",
      async validate(filePath) {
        if (filePath.toLowerCase() === "exit") {
          console.log("\nOperation canceled by user");
          process.exit(1);
        }
        // TODO: Improve this logic
        if (!filePath?.includes(".json") && !filePath?.includes(".csv"))
          return "Add file extension";

        const fileExists = fs.existsSync(filePath);

        if (fileExists) {
          const file = await reader(filePath);
          if (!file.length) {
            console.log("\nThis file is empty");
            process.exit(1);
          }
        }

        return fileExists || `File "${filePath}" not found`;
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
