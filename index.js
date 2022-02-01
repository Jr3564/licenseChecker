const reader = require("./fileHandler/reader");
const reportsinterface = require("./reportsHandler/interface");
const { prompt } = require("inquirer");
const fs = require("fs");

const read = (filePath) =>
  reader(filePath, (err) => {
    console.log(err);
  }).then((jonsonLicenses) => JSON.parse(jonsonLicenses));

(() => {
  const question = {
    type: "input",
    name: "filePath",
    message: "Analyze file ./",
    async validate(fileName) {
      // TODO: Improve this logic
      if (!fileName?.includes(".json")) return "Only JSON files for now";
      return fs.existsSync(fileName) || `File "${fileName}" not found`;
    },
  };

  prompt([question]).then(async ({ filePath }) => {
    const licenses = await read(filePath);
    reportsinterface(licenses);
  });
})();
