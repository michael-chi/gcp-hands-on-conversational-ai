const csv = require('csv-parser');
const fs = require('fs');
const GoogleMap = require('../../processors/GoogleMap.js');
var dataFiles = ['./data/a_lvr_land_a.csv', './data/f_lvr_land_a.csv', './data/h_lvr_land_a.csv'];
var resultFiles = ['./data/2_result_taipei.json', './data/2_result_newtaipei.json', './data/2_result_taoyuan.json'];
const config = require('../../keys/config.json');
var gmap = new GoogleMap(config);
var map = new Map();

map.set('taipei', './data/a_lvr_land_a.csv');
map.set('newtaipei', './data/f_lvr_land_a.csv');
map.set('taoyuan', './data/h_lvr_land_a.csv');

map.forEach((value, key) => {
    var result = [];
    var isHeader = true;
    index = 0;
    fs.createReadStream(value)
        .pipe(csv())
        .on('data', async (row) => {
            if(isHeader){
                isHeader = false;
                return;
            }
            //console.log(row);
            const addresses = row['土地區段位置建物區段門牌'];
            const address = addresses.split('~')[0] + '號';

            //  Avoid exceed quota
            index++;
            if(index % 50 == 0){
                Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3);
            }
            
            const coordinates = await gmap.getGeoCoordinates(address);
            result.push({
                address:address,
                coordinates: coordinates
            });
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            console.log(key);
            fs.writeFile(`./data/result_${key}.json`, JSON.stringify(result), () => { console.log('wrote to output file.');});
        });
});
