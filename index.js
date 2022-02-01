const reader = require("./file_handler/reader");
const interface = require("./reports_handler/interface");

// Quero catalogar minhas licenças (Pode demorar um pouco)
// Quero fazer relatorio do meu catalogo de licenças ... na pasta:

(async () => {
  const licences = await reader("./data/extracted_license.json", (err) => {
    console.log(err);
  }).then((jsonList) => JSON.parse(jsonList));

  interface(licences);
})();
