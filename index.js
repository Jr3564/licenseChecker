const reader = require("./fileHandler/reader");
const { csvToObject, jsonToObject } = require("./fileHandler/converter");
const prompts = require("./reportsHandler/prompts");
const options = require("./reportsHandler/options");

prompts.typeFilePathToReadingPrompt(["json", "csv"], async (filePath) => {
  const dependenciesInputed = await reader(filePath);

  const dependencies = filePath.includes(".csv")
    ? csvToObject(dependenciesInputed)
    : jsonToObject(dependenciesInputed);

  const choices = {
    option_1: "List number of dependencies by license type",
    option_2: "List dependencies by license type",
    option_3: "Export dependencies by license type",
    option_4:
      "Get licenses and permissions." +
      "(A request will be made for each license type in dependencies)",
    option_5: "List dependencies permissions",
  };

  prompts.choiceOneOptionPrompt(choices, async (choice) => {
    const printResult = (result) => console.log(result);
    switch (choice) {
      case choices.option_1:
        options.option_1(dependencies, printResult);
        break;
      case choices.option_2:
        options.option_2(dependencies, printResult);
        break;
      case choices.option_3:
        options.option_3(dependencies, printResult);
        break;
      case choices.option_4:
        await options.option_4(dependencies, printResult);
        break;
      case choices.option_5:
        await options.option_5(dependencies, printResult);
        break;
    }
  });
});
