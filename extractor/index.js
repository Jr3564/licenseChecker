const reader = require("../fileHandler/reader");
const prompts = require("../reportsHandler/prompts");
const writer = require("../fileHandler/writer");
const scraper = require("./scraper");


const readDependenciesIn = async (filePath) => {
  const { dependencies } = await reader(filePath).then((data) =>
    JSON.parse(data)
  );
  return Object.keys(dependencies)
}

const mapDependenciesForEachFilePath = async (filePaths) => {
  const pathPromisses = filePaths.map(filePath => readDependenciesIn(filePath));

  const mapAndFilterResult = (promiseResult => {
    return promiseResult.map(({ value }) => value).filter((value) => !!value)
  })

  const allDependenciesPerPath = await Promise.allSettled(pathPromisses)
    .then(mapAndFilterResult)

  return allDependenciesPerPath.reduce((allDependencies, dependenciesList) => {
    return [...new Set([...allDependencies, ...dependenciesList])]
  },[])

}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchAndScrapeDependencies = (dependencies) => {
  const dependenciesPromisses = dependencies.map((key) => {
    wait(1000)
    return scraper.fetchDependency(key).then(({ data: htmlData }) => {
      console.log(`...Scraping ${key} dependency`)

      return scraper.scrape(htmlData).then((data) => ({ name: key, ...data }))

    }).catch(err => {
      console.log(`${key} not found\n err: ${err.message}`);

    });
  });

  const mapAndFilterResult = (promiseResult => {
    return promiseResult.map(({ value }) => value).filter((value) => !!value)
  })

  return Promise.allSettled(dependenciesPromisses).then(mapAndFilterResult)
}

module.exports = async () => {
  prompts.typeManyFilePathToReadingPrompt(["json"], async (filePaths)=> {
    const dependencyList = await mapDependenciesForEachFilePath(filePaths);
    const dependencies = await fetchAndScrapeDependencies(dependencyList);

    prompts.typeFilePathToExportionPrompt(["json", "csv"], async (filePath) => {

      await writer.convertAndWrite(dependencies, filePath);

      console.log(`Saved in ${__dirname}/${filePath}`);
    });
  })
};
