const options = require("./options");
const { prompt } = require("inquirer");

const generateQuestions = (choices) => {
  return [
    {
      type: "list",
      name: "choice",
      message: "O que você deseja fazer?",
      choices: [...Object.values(choices)],
    },
  ];
};

module.exports = (licences) => {
  const choices = {
    option_1: "Listar quantidade de licenças por tipo",
    option_2: "Listar licenças detalhadas",
  };

  const questions = generateQuestions(choices);

  prompt(questions).then(({ choice }) => {
    switch (choice) {
      case choices.option_1:
        options.option_1(licences);
        break;

      case choices.option_2:
        options.option_2(licences);
        break;
    }
  });
};
