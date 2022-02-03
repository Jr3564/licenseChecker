const removeQuotes = (word) =>
  word[0] === "'" || word[0] === '"' ? word.slice(1, -1) : word;

const addQuotes = (word, quote = '"') =>
  word[0] === quote ? word : quote + word + quote;

const capitalize = (word) => word[0].toUpperCase() + word.substr(1);

const toCamelCase = (keyWithSpaces) => {
  const words = keyWithSpaces.split(" ");
  const firstWord = words.shift().toLowerCase();
  return words.reduce((acc, key) => acc + capitalize(key), firstWord);
};

exports.csvToObject = (licensesCSV) => {
  const lines = licensesCSV.split("\n").filter((line) => !!line);
  const fistLinekeys = lines.shift().split(",");
  const keys = fistLinekeys.map((key) => toCamelCase(removeQuotes(key)));

  const result = lines.map((line) => {
    return line.split(",").reduce((acc, value, index) => {
      return { ...acc, [keys[index]]: removeQuotes(value) };
    }, {});
  });

  return result;
};

exports.jsonToObject = (licensesJson) => JSON.parse(licensesJson);

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

exports.objectToCSV = (licences) => {
  const fistLinekeys = Object.keys(licences[0]);
  return licences.reduce(
    (lines, line) => {
      const arrayLine = extractValuesAccording(fistLinekeys, line);
      const stringLine = arrayToStringsLine(arrayLine, '"');
      return [...lines, stringLine];
    },
    [arrayToStringsLine(fistLinekeys, '"')]
  );
};
