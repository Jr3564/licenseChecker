const service = require("./services");
const writer = require("../fileHandler/writer");
const { objectToCSV } = require("../fileHandler/converter");
const prompts = require("./prompts");
const axios = require("axios");

const defaultCallback = () => {};

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

const option_1 = (dependencies, callback = defaultCallback) => {
  const licenceAmounts = service.getLicensesAmountIn(dependencies);
  callback(licenceAmounts);
};

const option_2 = (dependencies, callback = defaultCallback) => {
  const licenceTypes = service.getLicensesTypesIn(dependencies);

  prompts.typeLicensePrompt(licenceTypes, (licenseType) => {
    const filtredLicenses = service.getLicensesFilter(
      licenseType,
      dependencies
    );
    callback(filtredLicenses);
  });
};

const option_3 = (dependencies, callback = defaultCallback) => {
  const licenceTypes = service.getLicensesTypesIn(dependencies);

  prompts.typeLicensePrompt(licenceTypes, (licenseType) => {
    const filtredDependencies = service.getLicensesFilter(
      licenseType,
      dependencies
    );

    prompts.typeFilePathToExportionPrompt(["json", "csv"], async (filePath) => {
      const convertedDependencies = filePath.includes(".csv")
        ? objectToCSV(filtredDependencies)
        : JSON.stringify(filtredDependencies, "", 2);

      await writer(convertedDependencies, filePath);

      callback(`Saved in ${__dirname}/${filePath}`);
    });
  });
};

const option_4 = async (licenses, callback = defaultCallback) => {
  const licenceTypes = service.getLicensesTypesIn(licenses);

  const mappedLicenses = await getAndMapLicensesByType(licenceTypes);

  callback(mappedLicenses);
};

const option_5 = async (dependencies, callback = defaultCallback) => {
  const licenceTypes = service.getLicensesTypesIn(dependencies);

  const mappedLicenses = await getAndMapLicensesByType(licenceTypes);

  const dependenciesWithLicenses = dependencies.map((dependency) => ({
    ...dependency,
    permissions: mappedLicenses[dependency.license.toLowerCase()],
  }));

  prompts.typeFilePathToExportionPrompt(["json"], async (filePath) => {
    const convertedDependencies = JSON.stringify(
      dependenciesWithLicenses,
      "",
      2
    );

    await writer(convertedDependencies, filePath);

    callback(`Saved in ${__dirname}/${filePath}`);
  });
};

module.exports = {
  option_1,
  option_2,
  option_3,
  option_4,
  option_5,
};
