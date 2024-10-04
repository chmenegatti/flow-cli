const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class MermaidFlowchartGenerator {
  constructor(data) {
    this.data = data;
  }

  async generate(filename) {
    let diagram = 'graph LR\n';
    this.data.forEach(item => {
      diagram += `  ${item.this} -->|next| ${item.next}\n`;
      diagram += `  ${item.this} -->|error| ${item.error}\n`;
    });
    filename = path.join('output', filename + '.mmd');
    fs.writeFileSync(filename, diagram, 'utf-8');
  }

  async generateSVG(source, filename) {
    const output = path.join(filename + '.svg');
    source = path.join('output', source);
    exec(`mmdc -i ${source}.mmd -o ${output}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao gerar SVG: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log('SVG gerado com sucesso.');
    });
  }

  async generatePNG(source, filename) {
    const output = path.join(filename + '.png');
    source = path.join('output', source);
    exec(`mmdc -i ${source}.mmd -o ${output} --scale 8`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao gerar PNG: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log('PNG gerado com sucesso.');
    });
  }
}

module.exports = MermaidFlowchartGenerator;
