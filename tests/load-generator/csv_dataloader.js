const csv = require('csv-parser');
const fs = require('fs');
const GoogleMap = require('../../processors/GoogleMap.js');
const config = require('../../keys/config.json');
var gmap = new GoogleMap(config);

const keys = ['taipei', 'newtaipei', 'taoyuan'];
const dataFiles = ['./data/a_lvr_land_a.csv', './data/f_lvr_land_a.csv', './data/h_lvr_land_a.csv'];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

var items = [];

for (var i = 0; i < dataFiles.length; i++) {
    key = keys[i];
    var result = [];

    if (!fs.exists(`data/result_${key}.json`, exists => {
        if (!exists) {
            //fs.openSync(`./data/result_${key}.json`);
            fs.writeFileSync(`./data/result_${key}.json`, '');
        }
    }))

        fs.createReadStream(dataFiles[i])
            .pipe(csv())
            .on('data', async (row) => {
                //console.log(row);
                const addresses = row['土地區段位置建物區段門牌'];
                const address = addresses.split('~')[0] + '號';

                const record = {
                    address: address,
                    coordinates: null
                };
                items.push(record);
                //fs.appendFileSync(`./data/result_${key}.json`, JSON.stringify(record));
            })
            .on('end', async () => {
                for (var i = 1; i < items.length; i++) {
                    var address = items[i].address;
                    result = await gmap.getGeoCoordinates(address);
                    
                    items[i].coordinates = result;
                    fs.appendFileSync(`./data/result.json`, 
                                            JSON.stringify(items[i]) + ',',
                                            () => {});
                    if(++i % 10 == 0)
                        require('sleep').sleep(3);
                }
                console.log('CSV file successfully processed');
            });
};

