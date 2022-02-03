const options = require("./interfaceOptions");
const { prompt } = require("inquirer");

const generateQuestions = (choices) => {
  return [
    {
      type: "list",
      name: "choice",
      message: "What do you want to do?",
      choices: [...Object.values(choices)],
    },
  ];
};

module.exports = (licenses) => {
  const choices = {
    option_1: "List number of licenses by type",
    option_2: "List detailed licenses",
    option_3: "Export detailed licenses by type",
  };

  const questions = generateQuestions(choices);

  prompt(questions).then(({ choice }) => {
    const printResult = (result) => console.log(result);
    switch (choice) {
      case choices.option_1:
        options.option_1(licenses, printResult);
        break;

      case choices.option_2:
        options.option_2(licenses, printResult);
        break;

      case choices.option_3:
        options.option_3(licenses, printResult);
        break;
    }
  });
};
