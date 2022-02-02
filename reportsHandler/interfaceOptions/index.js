const { prompt } = require("inquirer");
const service = require("../reportHandlerServices");
const writer = require("../../fileHandler/writer");
const { objectToCSV } = require("../../fileHandler/converter");

// FIXME: CHECK EMPTY FILE
const option_1 = (licenses, callback = () => {}) => {
  const licenceAmounts = service.getLicensesAmountIn(licenses);
  callback(licenceAmounts);
};

// FIXME: CHECK EMPTY FILE
const option_2 = (licenses, callback = () => {}) => {
  const licenceTypes = service.getLicensesTypesIn(licenses);

  const question = [
    {
      type: "list",
      name: "type",
      message: "What license type?",
      choices: licenceTypes,
    },
  ];

  prompt(question).then(({ type }) => {
    const filtredLicenses = service.getLicensesFilter(type, licenses);
    callback(filtredLicenses);
  });
};

const option_3 = (licenses, callback = () => {}) => {
  const question = {
    type: "input",
    name: "filePath",
    message: "Export file to ./",
    async validate(filePath) {
      // TODO: logic repeats itself
      if (!filePath?.includes(".json") && !filePath?.includes(".csv"))
        return "Add file extension";
      return true;
    },
    filter: (answer) => answer.trim(),
  };
  option_2(licenses, async (filtredLicenses) => {
    prompt([question]).then(async ({ filePath }) => {
      const licenses = filePath.includes(".csv")
        ? objectToCSV(filtredLicenses)
        : JSON.stringify(filtredLicenses, "", 2);

      await writer(licenses, filePath, (err) => {
        console.log(err);
      });

      callback(`File was saved in ${__dirname}/${filePath}`);
    });
  });
};

module.exports = {
  option_1,
  option_2,
  option_3,
};
