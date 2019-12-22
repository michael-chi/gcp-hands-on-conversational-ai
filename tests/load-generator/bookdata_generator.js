const fs = require('fs');
const times = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1];
const time_chances = [0.0005, 0.001, 0.03, 0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.03, 0.04, 0.05, 0.1, 0.2]
const uuidv1 = require('uuid/v1');
const TaxiManager = require('./TaxiManager.js');
const CustomerManager = require('./CustomerManager.js');

var taxisMgr = new TaxiManager(10000);
var customersMgr = new CustomerManager(50000);

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateDailyTable(date, chanceTable, func) {
    var results = [];

    for (var i = 0; i < times.length; i++) {
        var currentChanceByTime = chanceTable[i];
        var currentTime = times[i];
        for (var min = 0; min < 60; min += 5) {
            var currentTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), times[i], min, 0);
            console.log(`***    ${currentTime.toLocaleString()}`);

            //  Is there anyone requesting a Taxi ?
            while (true) {
                var customerResult = customersMgr.findACustomer(currentTime, currentChanceByTime);

                if (customerResult && customerResult.customer) {
                    var taxi = taxisMgr.findAnAvailableTaxi(currentTime);
                    if (taxi) {
                        var distance = getDistance(customerResult.origin.coordinates.lat,
                            customerResult.origin.coordinates.lng,
                            customerResult.destination.coordinates.lat,
                            customerResult.destination.coordinates.lng);

                        console.log(`\t=> Total ${distance} km from ${JSON.stringify(customerResult.origin.coordinates)} to ${JSON.stringify(customerResult.destination.coordinates)}`);
                        customersMgr.updateCustomerStatus(customerResult.customer, currentTime, false, distance);
                        taxisMgr.updateTaxiStatus(taxi, currentTime, distance);

                        console.log(`\t=> [${currentTime}]Taxi[${taxi.plate}] taking customer[${customerResult.customer.id}]`);
                        console.log(`\t\tFrom [${customerResult.origin.address}] to [${customerResult.destination.address}]`);
                        console.log(`\t\tCustomer [${customerResult.customer.unavailableUntil}] } Taxi [${taxi.unavailableUntil}]`);

                        var result = {
                            conversationId: uuidv1(),
                            time: currentTime,
                            customer_hash: customerResult.customer.id,
                            plate_no: taxi.plate,
                            from_address: customerResult.origin.address.split('區')[0],
                            from_longitude: customerResult.origin.coordinates.lng,
                            from_latitude: customerResult.origin.coordinates.lat,
                            to_address: customerResult.destination.address.split('區')[0],
                            to_longitude: customerResult.destination.coordinates.lng,
                            to_latitude: customerResult.destination.coordinates.lat,
                            distance_km: distance
                        };
                        func(result);
                    } else {
                        console.log(`\tNo Taxi available`);
                    }
                } else {
                    console.log('No customer available');
                }
                if(!customerResult.continue){
                    console.log('All customer evaluated, next round');
                    break;
                }
            }
        }
    }
}

function getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

var start = new Date(process.argv[2]);
var end = new Date(process.argv[3]);
var moment = require('moment');

for (var m = moment(start); m.isBefore(end); m.add(1, 'days')) {
    const date = new Date(m.format('YYYY-MM-DD'));
    const fn = `./data/bookevents_${m.format('YYYY-MM-DD')}.json`;
    if (!fs.existsSync(fn)) {
        fs.writeFileSync(fn, '');
    }

    generateDailyTable(date, time_chances,
        (record) => {
            fs.appendFileSync(fn, JSON.stringify(record) + '\r\n', () => { });
        }
    );
    console.log(`successfully generated - ${fn}`);
}