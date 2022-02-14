const axios = require("axios");
const { parse } = require("node-html-parser");

const fetchDependency = (dependencyName) => {
  return axios.get(`https://www.npmjs.com/package/${dependencyName}`);
};

const selectByTitle = (parserRoot, title) => Array.from(parserRoot.querySelectorAll("h3").values()).find(
  (element) => element.innerText == title
).nextSibling.innerText;


const scrape = async (htmlText) => {
  const root = await parse(htmlText);

  const repository = root.querySelector('a[aria-labelledby="repository"]')
    .attributes.href;

  const license = selectByTitle(root, "License");

  const version = selectByTitle(root, "Version");

  return { repository, license, version };
};

module.exports = { scrape, fetchDependency }
