const { Command } = require('commander');
const path = require('path');
const Extractor = require('./extractor/app');
const JsonFileReader = require('./reader/JsonFileReader');
const ExchangeFinder = require('./finder/ExchangeFinder');
const MermaidFlowchartGenerator = require('./flowchart/MermaidFlowchartGenerator');

const program = new Command();

program
  .option('-g', 'Get data from etcd and save as JSON')
  .option('-e, --exchange <exchange>', 'Exchange name to find')
  .option('-o, --output <filename>', 'Output filename for results')
  .option('-p, --png <pngname>', 'Generate PNG with given name')
  .option('-s, --svg <svgname>', 'Generate SVG with given name');

program.parse(process.argv);

const options = program.opts();

const jsonDir = './json';
const outputDir = './output';

const runExtractor = async () => {
  const etcdHosts = '127.0.0.1:2379';
  const outputDir = './json';
  const extract = new Extractor(etcdHosts, outputDir);
  await extract.run();
}

const checkOutputFolder = () => {
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
}

const checkJsonFolder = () => {
  const fs = require('fs');
  if (!fs.existsSync(jsonDir)) {
    console.error('A pasta json não existe. Por favor, execute com a flag -g primeiro.');
    process.exit(1);
  }

  const files = fs.readdirSync(jsonDir);
  if (files.length === 0) {
      console.error('A pasta json está vazia. Por favor, execute com a flag -g primeiro.');
      process.exit(1);
  }
}

const runMain = async () => {
  if (options.g) {
    await runExtractor();  // Run the app function
  } else {
    checkJsonFolder();
  }

  checkOutputFolder();

  if (options.exchange && options.output) {
    // Run the exchange finder and save the results
    
    const reader = new JsonFileReader(jsonDir);
    const jsonData = await reader.readFiles();

    const finder = new ExchangeFinder(jsonData, options.output);
    const results = await finder.find(options.exchange);
    
    const generator = new MermaidFlowchartGenerator(results);
    await generator.generate(options.output);

    if (options.png) {
      const pngFilename = path.join(outputDir, `${options.png}`);
      await generator.generatePNG(options.output, pngFilename);
    }

    if (options.svg) {
      const svgFilename = path.join(outputDir,`${options.svg}`);
      await generator.generateSVG(options.output, svgFilename);
    }
  }
}
runMain().catch(error => {
  console.error(`Erro ao executar a aplicação: ${error.message}`);
});;