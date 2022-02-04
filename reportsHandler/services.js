const axios = require("axios");
const getLicensesAmountIn = (licensesList) => {
  return licensesList.reduce((licenses, { license }) => {
    if (licenses.hasOwnProperty(license)) {
      licenses[license] += 1;
    } else {
      licenses[license] = 1;
    }
    return licenses;
  }, {});
};

const getLicensesTypesIn = (licensesList) => {
  return licensesList.reduce((licenses, { license }) => {
    if (licenses.includes(license)) return licenses;
    return [...licenses, license];
  }, []);
};

const getLicensesFilter = (licenceType, licensesList) =>
  licensesList.filter(({ license }) => license === licenceType);

const getLicenseByType = (licenseType) => {
  const URL = "https://api.github.com/licenses/" + licenseType.toLowerCase();
  return axios.get(URL, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
};

const getAndMapLicensesByType = (licensesType) => {
  const requests = licensesType.map((licenseType) =>
    getLicenseByType(licenseType)
      .then(({ data }) => {
        const { key, permissions, conditions, limitations } = data;
        return { [key]: { permissions, conditions, limitations } };
      })
      .catch((response) => {
        const message = response?.response?.data?.message || response?.message;
        return { [licenseType]: message };
      })
  );

  return Promise.allSettled(requests).then((licenses) =>
    licenses.reduce((acc, crr) => ({ ...acc, ...crr.value }), {})
  );
};

const getDependenciesWithPermissions = async (dependencies) => {
  const licenceTypes = getLicensesTypesIn(dependencies);

  const mappedLicenses = await getAndMapLicensesByType(licenceTypes);

  return dependencies.map((dependency) => ({
    ...dependency,
    ...mappedLicenses[dependency.license.toLowerCase()],
  }));
};

module.exports = {
  getDependenciesWithPermissions,
  getAndMapLicensesByType,
  getLicensesAmountIn,
  getLicensesTypesIn,
  getLicensesFilter,
  getLicenseByType,
};
