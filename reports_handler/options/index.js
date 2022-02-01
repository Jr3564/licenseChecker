const service = require("../services");
const { prompt } = require("inquirer");

exports.option_1 = (licences) => {
  const licenceAmounts = service.getLicensesAmountIn(licences);
  console.log();
  console.log(licenceAmounts);
  console.log();
};

exports.option_2 = (licences) => {
  const licenceTypes = service.getLicensesTypesIn(licences);

  const question = [
    {
      type: "list",
      name: "type",
      message: "Selecione uma tipo de licença: ",
      choices: licenceTypes,
    },
  ];

  prompt(question).then(({ type }) => {
    console.log();
    console.log(service.getLicensesFilter(type, licences));
    console.log();
  });
};
