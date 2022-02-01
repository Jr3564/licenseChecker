exports.getLicensesAmountIn = (licensesList) => {
  return licensesList.reduce((licenses, { license }) => {
    if (licenses.hasOwnProperty(license)) {
      licenses[license] += 1;
    } else {
      licenses[license] = 1;
    }
    return licenses;
  }, {});
};

exports.getLicensesTypesIn = (licensesList) => {
  return licensesList.reduce((licenses, { license }) => {
    if (licenses.includes(license)) return licenses;
    return [...licenses, license];
  }, []);
};

exports.getLicensesFilter = (licenceType, licensesList) =>
  licensesList.filter(({ license }) => license === licenceType);
