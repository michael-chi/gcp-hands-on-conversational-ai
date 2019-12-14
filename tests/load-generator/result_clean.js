Array.prototype.distinct = function () {
    var results = [];
    var addresses = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i]) {
            console.log(`checking item [${i}]${JSON.stringify(this[i]['address'])}`);
            if (addresses.indexOf(this[i]['address']) == -1) {
                console.log('counted...');
                results.push(this[i]);
                addresses.push(this[i]['address']);
            }
        }
    }
    return results;
}

var records = require('./data/result.json');
var non_null_data = records.filter(record => record.coordinates != null && record.coordinates != 'undefined');
var distincted = non_null_data.distinct();

require('fs').writeFileSync('./data/simulation_addresses.json', JSON.stringify(distincted));