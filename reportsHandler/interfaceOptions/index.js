const { prompt } = require("inquirer");
const service = require("../reportHandlerServices");
const jsonWriter = require("../../fileHandler/jsonWriter");

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
  };
  option_2(licenses, async (filtredLicenses) => {
    prompt([question]).then(async ({ filePath }) => {
      const jsonFiltredLicenses = JSON.stringify(filtredLicenses, "", 2);

      await jsonWriter(jsonFiltredLicenses, filePath, (err) => {
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
