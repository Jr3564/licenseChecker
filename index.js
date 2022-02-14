const reportsHandler = require('./reportsHandler');
const extractor = require('./extractor');

const prompts = require("./reportsHandler/prompts");

  const choices = {
    option_1: "Manipulate a json or csv file",
    option_2: "Extract dependencies",
  };

  prompts.choiceOneOptionPrompt(choices, async (choice) => {
    switch (choice) {
      case choices.option_1:
        reportsHandler()
        break;
      case choices.option_2:
        extractor()
        break;
    }
  });

