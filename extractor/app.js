const EtcdClient = require('./EtcdClient');
const JsonSaver = require('./JsonSaver');

class Extractor {
  constructor(etcdHosts, outputDir) {
    this.etcdClient = new EtcdClient(etcdHosts);
    this.jsonSaver = new JsonSaver(outputDir);
  }

  async run() {
    const filteredKeys = await this.etcdClient.readAllKeys();
    if (filteredKeys) {
      this.jsonSaver.saveKeysAsJson(filteredKeys);
    }
  }
}

module.exports = Extractor;
