const { Etcd3 } = require('etcd3');

class EtcdClient {
  constructor(hosts) {
    this.client = new Etcd3({ hosts });
  }

  async readAllKeys() {
    try {
      const allKeys = await this.client.getAll().strings();
      const filteredKeys = Object.keys(allKeys).reduce((acc, key) => {
        if (!key.includes('/env-')) {
          acc[key] = allKeys[key];
        }
        return acc;
      }, {});

      return filteredKeys;
    } catch (error) {
      console.error('Erro ao ler as chaves do etcd:', error);
    } finally {
      this.client.close();
    }
  }
}

module.exports = EtcdClient;
