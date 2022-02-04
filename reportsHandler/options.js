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

const getPermissionListOf = (dependencies) => {
  return new Set(
    dependencies.reduce((acc, dependency) => {
      if (!dependency?.permissions) return acc;
      return [...acc, ...dependency.permissions];
    }, [])
  );
};

exports.option_6 = async (dependencies, callback) => {
  const dependenciesWithLicenses = await service.getDependenciesWithPermissions(
    dependencies
  );

  const result = dependenciesWithLicenses.reduce(
    (acc, { name, license, linkUrl, permissions }) => {
      const licensePermissions = new Set(permissions);
      const permissionKeys = [...getPermissionListOf(dependencies)].reduce(
        (acc, permissionKey) => ({
          ...acc,
          [permissionKey]: licensePermissions.has(permissionKey),
        }),
        {}
      );
      return { ...acc, [name]: { license, ...permissionKeys, linkUrl } };
    },
    {}
  );
  callback(result);
};
