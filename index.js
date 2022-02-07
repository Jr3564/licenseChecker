const reader = require("./fileHandler/reader");
const { csvToObject, jsonToObject } = require("./fileHandler/converter");
const prompts = require("./reportsHandler/prompts");
const options = require("./reportsHandler/options");

prompts.typeFilePathToReadingPrompt(["json", "csv"], async (filePath) => {
  const dependenciesInputed = await reader(filePath);

  const dependencies = filePath.includes(".csv")
    ? csvToObject(dependenciesInputed)
    : jsonToObject(dependenciesInputed);

  const fetchMessage =
    "(A request will be made for each license type in dependencies)";
  const choices = {
    option_1: "List number of dependencies by license type",
    option_2: "List dependencies by license type",
    option_3: "Export dependencies by license type",
    option_4:
      "Export licenses permissions, conditions and limitations." + fetchMessage,
    option_5: "Export detailed dependencies with permissions" + fetchMessage,
    option_6: "Print table of dependencies and license status" + fetchMessage,
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
      case choices.option_6:
        await options.option_6(dependencies, (result) => {
          console.table(result);
        });
        break;
    }
  });
});
