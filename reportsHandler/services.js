const axios = require("axios");
const converter = require("../fileHandler/converter");
const getLicensesAmountIn = (dependencies) => {
  return dependencies.reduce((dependency, { license }) => {
    if (dependency.hasOwnProperty(license)) {
      dependency[license] += 1;
    } else {
      dependency[license] = 1;
    }
    return dependency;
  }, {});
};

const getLicensesTypesIn = (dependencies) => {
  return dependencies.reduce((dependency, { license }) => {
    if (dependency.includes(license)) return dependency;
    return [...dependency, license];
  }, []);
};

const getLicensesFilter = (licenceType, dependencies) =>
  dependencies.filter(({ license }) => license === licenceType);

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

const extractKeyListOf = (dependencies, keys) => {
  return keys.map((key) => {
    return Array.from(
      new Set(
        dependencies.reduce((acc, dependency) => {
          if (!dependency[key]) return acc;
          return [...acc, ...dependency[key]];
        }, [])
      )
    );
  });
};

const mapKeySet = (setKey, keys, addKey) => {
  return setKey?.reduce(
    (acc, key) => ({
      ...acc,
      [converter.toCamelCase(key) + converter.capitalize(addKey)]: new Set(
        keys
      ).has(key),
    }),
    {}
  );
};

const mapArrayValeusOf = (key, dependencies) => {
  const [allValues] = extractKeyListOf(dependencies, [key]);

  dependencies.forEach((dependency, index) => {
    const keyArrValue = dependency[key];
    delete dependency[key];
    dependencies[index] = {
      ...dependency,
      ...mapKeySet(allValues, keyArrValue, key),
    };
  });
};

module.exports = {
  getDependenciesWithPermissions,
  getAndMapLicensesByType,
  getLicensesAmountIn,
  getLicensesTypesIn,
  getLicensesFilter,
  getLicenseByType,
  mapArrayValeusOf,
};
