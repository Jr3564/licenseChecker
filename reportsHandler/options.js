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

    prompts.typeFilePathToExportionPrompt(["json"], async (filePath) => {
      await writer.convertAndWrite(filtredDependencies, filePath);

      callback(`Saved in ${__dirname}/${filePath}`);
    });
  });
};

exports.option_4 = async (dependencies, callback) => {
  const licenceTypes = service.getLicensesTypesIn(dependencies);

  const mappedLicenses = await service.getAndMapLicensesByType(licenceTypes);

  callback(mappedLicenses);
};

exports.option_5 = async (dependencies, callback) => {
  const dependenciesWithLicenses = await service.getDependenciesWithPermissions(
    dependencies
  );

  prompts.typeFilePathToExportionPrompt(["json"], async (filePath) => {
    await writer.convertAndWrite(dependenciesWithLicenses, filePath);

    callback(`Saved in ${__dirname}/${filePath}`);
  });
};

exports.option_6 = async (dependencies, callback) => {
  const dependenciesWithLicenses = await service.getDependenciesWithPermissions(
    dependencies
  );

  //
  ["permissions", "conditions", "limitations"].forEach((key) => {
    service.mapArrayValeusOf(key, dependenciesWithLicenses);
  });

  // logic made for print only
  const dependenciesWithLicensesToPrint = dependenciesWithLicenses.map(
    (dependency) => ({
      name: dependency["name"],
      license: dependency["license"],
      ...Object.entries(dependency).reduce((acc, [key, value]) => {
        if (key.includes("Permissions")) return { ...acc, [key]: value };
        return acc;
      }, {}),
    })
  );

  callback(dependenciesWithLicensesToPrint);

  prompts.choiceToSaveBooleanOptionPrompt((saveReport) => {
    if (saveReport) {
      prompts.typeFilePathToExportionPrompt(["csv"], async (filePath) => {
        await writer.convertAndWrite(dependenciesWithLicenses, filePath);

        console.log(`Saved in ${__dirname}/${filePath}`);
      });
    }
  });
};
