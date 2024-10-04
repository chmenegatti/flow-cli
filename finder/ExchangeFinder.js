const fs = require('fs');
const path = require('path');
const QuickSort = require('../sorting/QuickSort');

class ExchangeFinder {
  constructor(data, filename) {
    this.data = data;
    this.filename = filename;
  }

  async find(exchangeValue) {
    let results = this.data.reduce((acc, { fileName, content }) => {
      if (Array.isArray(content)) {
        content.forEach(item => {
          if (item.Exchange === exchangeValue) {
            acc.push({
              "etcd": fileName.replace('.json', ''),
              "this": item.BindingKey,
              "next": item.OkRoutingKey,
              "error": item.ErrorRoutingKey
            });
          }
        });
      } else if (content.Exchange === exchangeValue) {
        acc.push({
          "etcd": fileName.replace('.json', ''),
          "this": content.BindingKey,
          "next": content.OkRoutingKey,
          "error": content.ErrorRoutingKey
        });
      }
      return acc;
    }, []);

    results.sort(QuickSort.compare);
    this.filename = path.join('output', this.filename + '.json');
    fs.writeFileSync(this.filename, JSON.stringify(results, null, 2), 'utf-8');
    return results;
  }
}

module.exports = ExchangeFinder;
