const removeQuotes = (word) => {
  const wordSet = new Set(word);
  return wordSet.has("'") || wordSet.has('"') ? word.slice(1, -1) : word;
};

const addQuotes = (word, quote = '"') => {
  if (typeof word === "string") {
    const wordSet = new Set(word);
    return wordSet.has("'") || wordSet.has('"') ? word : quote + word + quote;
  }
  return word;
};

const capitalize = (word) => word[0].toUpperCase() + word.substr(1);

const toCamelCase = (keyWithSpaces) => {
  let words = keyWithSpaces.split(" ");
  if (new Set(keyWithSpaces).has("-")) words = keyWithSpaces.split("-");
  const firstWord = words.shift().toLowerCase();
  return words.reduce((acc, key) => acc + capitalize(key), firstWord);
};
const csvToObject = (dependenciesCSV) => {
  const lines = dependenciesCSV.split("\n").filter((line) => !!line);
  const fistLinekeys = lines.shift().split(",");
  const keys = fistLinekeys.map((key) => toCamelCase(removeQuotes(key)));
  const result = lines.map((line) => {
    return line.split(",").reduce((acc, value, index) => {
      let cleanValue = removeQuotes(value);
      // TODO: improve
      if (cleanValue === "true" || cleanValue === "false")
        cleanValue = cleanValue === "true";
      return { ...acc, [keys[index]]: cleanValue };
    }, {});
  });

  return result;
};

const jsonToObject = (dependenciesJson) => JSON.parse(dependenciesJson);

const extractValuesAccording = (keys, values) => [
  ...keys.map((key) => values[key]),
];

const arrayToStringsLine = (array, valuesQuotes = "") =>
  array.reduce((stringLine, value, index) => {
    const commaOrLineBreak = index + 1 < array.length ? "," : "\n";
    const valueWithQuotes = valuesQuotes
      ? addQuotes(value, valuesQuotes)
      : value;
    return stringLine + valueWithQuotes + commaOrLineBreak;
  }, "");

const objectToCSV = (dependencies) => {
  const fistLinekeys = Object.keys(dependencies[0]);

  return dependencies.reduce(
    (lines, line) => {
      const arrayLine = extractValuesAccording(fistLinekeys, line);
      const stringLine = arrayToStringsLine(arrayLine, '"');
      return [...lines, stringLine];
    },
    [arrayToStringsLine(fistLinekeys, '"')]
  );
};

module.exports = {
  toCamelCase,
  csvToObject,
  jsonToObject,
  objectToCSV,
  capitalize,
};
