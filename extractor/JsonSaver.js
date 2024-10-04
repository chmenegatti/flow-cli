const fs = require('fs');
const path = require('path');

class JsonSaver {
  constructor(outputDir) {
    this.outputDir = outputDir;
  }

  saveKeysAsJson(keys) {
    // Cria o diretório, caso não exista
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir);
    }

    // Salva cada chave como um arquivo .json
    Object.keys(keys).forEach((key) => {
      const sanitizedKey = key.replace(/\//g, '');
      const filePath = path.join(this.outputDir, `${sanitizedKey}.json`);

      let value = keys[key];

      // Tenta parsear o valor como JSON, se for possível
      try {
        value = JSON.parse(value);
      } catch (error) {
        console.warn(`Valor da chave ${key} não é JSON válido. Salvando como string.`);
      }

      // Cria o arquivo JSON com o conteúdo bem formatado
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2)); // Formatação com 2 espaços
      console.log(`Salvo: ${filePath}`);
    });
  }
}

module.exports = JsonSaver;
