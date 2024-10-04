const fs = require('fs');
const path = require('path');

class JsonFileReader {
  constructor(directory) {
    this.directory = directory;
  }

  async readFiles() {
    const files = fs.readdirSync(this.directory);
    return files.map(file => {
      const filePath = path.join(this.directory, file);
      if (path.extname(filePath) === '.json') {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return { fileName: file, content: content };
      }
    }).filter(Boolean);
  }
}

module.exports = JsonFileReader;
