const service = require("./services");
const writer = require("../fileHandler/writer");
const prompts = require("./prompts");

exports.option_1 = (dependencies, callback) => {
  const licenceAmounts = service.getLicensesAmountIn(dependencies);
  callback(licenceAmounts);
};

exports.option_2 = (dependencies, callback) => {
  const licenceTypes = service.getLicensesTypesIn(dependencies);

  prompts.typeLicensePrompt(licenceTypes, (licenseType) => {
    const filtredLicenses = service.getLicensesFilter(
      licenseType,
      dependencies
    );
    callback(filtredLicenses);
  });
};

exports.option_3 = (dependencies, callback) => {
  const licenceTypes = service.getLicensesTypesIn(dependencies);

  prompts.typeLicensePrompt(licenceTypes, (licenseType) => {
    const filtredDependencies = service.getLicensesFilter(
      licenseType,
      dependencies
    );

    prompts.typeFilePathToExportionPrompt(["json", "csv"], async (filePath) => {
      await writer.convertAndWrite(filtredDependencies, filePath);

      callback(`Saved in ${__dirname}/${filePath}`);
    });
  });
};

exports.option_4 = async (licenses, callback) => {
  const licenceTypes = service.getLicensesTypesIn(licenses);

  const mappedLicenses = await service.getAndMapLicensesByType(licenceTypes);

  callback(mappedLicenses);
};

exports.option_5 = async (dependencies, callback) => {
  const licenceTypes = service.getLicensesTypesIn(dependencies);

  const mappedLicenses = await service.getAndMapLicensesByType(licenceTypes);

  const dependenciesWithLicenses = dependencies.map((dependency) => ({
    ...dependency,
    permissions: mappedLicenses[dependency.license.toLowerCase()],
  }));

  prompts.typeFilePathToExportionPrompt(["json"], async (filePath) => {
    await writer.convertAndWrite(dependenciesWithLicenses, filePath);

    callback(`Saved in ${__dirname}/${filePath}`);
  });
};
