const endCutter = (string) => string.slice(1, -1);

exports.csvToObject = (licensesCSV) => {
  const lines = licensesCSV.split("\n");
  const keys = lines.shift().split(",");

  const jsKeysDefaults = keys.map((key) => {
    const keyArr = key.split(" ");
    const newKey =
      keyArr.length < 2
        ? keyArr[0].toLowerCase()
        : keyArr[0].toLowerCase() + keyArr[1];
    return endCutter(newKey);
  });

  return lines.map((column) => {
    return column.split(",").reduce((acc, key, index) => {
      return { ...acc, [jsKeysDefaults[index]]: endCutter(key) };
    }, {});
  });
};

exports.jsonToObject = (licensesJson) => JSON.parse(licensesJson);

// TODO: Improve this logic
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
