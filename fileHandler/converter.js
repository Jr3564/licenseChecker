const endCutter = (string) => string.slice(1, -1);

exports.csvToObject = (licensesCSV) => {
  const lines = licensesCSV.split("\n").filter((line) => !!line);
  const keys = lines.shift().split(",");

  const jsKeysDefaults = keys.map((key) => {
    const keyArr = key.split(" ");
    const newKey =
      keyArr.length < 2
        ? keyArr[0].toLowerCase()
        : keyArr[0].toLowerCase() + keyArr[1];
    return endCutter(newKey);
  });

  const result = lines.map((column) => {
    return column.split(",").reduce((acc, key, index) => {
      return { ...acc, [jsKeysDefaults[index]]: endCutter(key) };
    }, {});
  });

  return result;
};

exports.jsonToObject = (licensesJson) => JSON.parse(licensesJson);

exports.objectToCSV = (licences) => {
  const keys = Object.keys(licences[0]);
  const linesColumns = licences.reduce(
    (acc, crr) => {
      return [...acc, [...keys.map((key) => crr[key])]];
    },
    [keys]
  );
  return linesColumns.map((line) => {
    const values = line.map((value) => `"${value}"`);
    return values.join(",") + "\n";
  });
};
