const fs = require('fs');

const times = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1];
const time_chances = [0.05, 0.2, 0.3, 0.5, 0.6, 0.5, 0.4, 0.5, 0.4, 0.4, 0.4, 0.4, 0.5, 0.6, 0.6, 0.5, 0.05, 0.02, 0.02, 0.02, 0.02]
const addresses = require('./data/simulation_addresses.json');
const uuidv1 = require('uuid/v1');

const VIPs = [9000001, 9000002];

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function buildChanceTable(hours, chances) {
    if (hours.length != chances.length) {
        throw 'hours and changes must have same length';
    }
    var map = new Map();
    for (var i = 0; i < hours.length; i++) {
        map.set(hours[i], chances[i]);
    }
    return map;
}

function updateTaxiStatus(taxi, currentTime, distance) {
    //  Take 1 hour for this customer, update Taxi
    taxi.available = false;

    var newTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(),
        currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());


    newTime.setMinutes(currentTime.getMinutes() + distance * 7);    //  roughly 7 minutes for 1 km
    taxi.unavailableUntil = newTime;//new Date(newTime);

    return taxi;
}

function getNextAvailableTaxi(taxis, currentTime) {
    var result = null;
    for (var i = 0; i < taxis.length; i++) {
        var v = taxis[i];
        if (v.unavailableUntil && v.unavailableUntil <= currentTime) {
            v.available = true;
            v.unavailableUntil = null;
        }
        if (v.available && v.chance > Math.random()) {
            console.log(`\t${v.plate} is available!`);
            result = v;
            break;
        }
    }
    return result;
}

function buildCustomers(count) {
    var customers = [];//new Map();
    for (var i = 0; i < count; i++) {
        customers.push({
            id: i,
            chance: Math.random(),
            available: true,
            unavailableUntil: null   //DateTime
        });
    }
    //  VIP
    for (var vip in VIPs) {
        customers.push({
            id: vip,
            chance: 1,
            available: true,
            unavailableUntil: null   //DateTime
        });
    }

    return customers;
}

function getRandomPlateText(len) {
    var emptyString = "";
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    while (emptyString.length < len) {
        emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return emptyString;
}

function buildTaxis(count) {
    var map = [];//new Map();
    for (var i = 0; i < count; i++) {
        var plateNoNumber = Math.floor(Math.random() * 9999).toString().padStart(4, '9');
        var plateNoText = getRandomPlateText(2);
        var plate = `${plateNoNumber}-${plateNoText}`;
        map.push(
            {
                plate: plate,
                chance: Math.random(),
                available: true,
                unavailableUntil: null   //DateTime            
            });
    }
    return map;
}
function findAnAvailableTaxi(taxis, currentTime) {
    var taxi = getNextAvailableTaxi(taxis, currentTime);
    if (!taxi) {
        console.log(`No available Taxi found`);
        return null;
    } else if (taxi &&
        taxi.chance * Math.random() >= Math.random() * Math.random()) {
        console.log(`Taxi ${taxi.plate} take customer`);
        return taxi;
    }
}
function updateCustomerStatus(customer, currentTime, isAvailable, distance) {
    //  Update Cutomer
    customer.available = isAvailable;
    var newTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(),
        currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

    if (VIPs.find(vip => vip == customer.id)) {
        console.log(`VIP ${customer.id} took a Taxi at ${currentTime}`);
        newTime.setMinutes(currentTime.getMinutes() + distance * 7 + 60 * 16);
    } else {
        newTime.setMinutes(currentTime.getMinutes() + distance * 7 + 60 * random(4));
    }
    customer.unavailableUntil = newTime;//new Date(newTime);
}
function findACustomer(customers, currentTime, currentChanceByTime) {
    //  Assumption: People is less likely to take TAXI on Sunday and Saturday
    var currentChangeOfTakingTaxiByTime = currentTime.getDay() == 0 ? currentChanceByTime / 4 : currentChanceByTime;
    currentChangeOfTakingTaxiByTime = currentTime.getDay() == 6 ? currentChanceByTime / 3 : currentChanceByTime;

    //  Is there anyone requesting a Taxi ?
    for (var k = 0; k < customers.length; k++) {
        var customer = customers[k];
        //  Update this customer's status
        if (customer.unavailableUntil >= currentTime) {
            customer.available = true;
            //customers.set(v.id, v);
            customers[k] = customer;
        }
        if (customer.available && customer.chance >= Math.random() && currentChangeOfTakingTaxiByTime >= Math.random()) {
            //  I need a Taxi now
            console.log(`${customer.id} is requesting Taxi...`);
            const origin = addresses[random(addresses.length)];
            const destination = addresses[random(addresses.length)];
            //console.log(`from ${JSON.stringify(origin)} to ${JSON.stringify(destination)}\r\ncontinue:${}<=${}:${k <= customers.length}`);

            var result = {
                continue: (k <= customers.length),  //last customer in the list
                customer: customer,
                origin: origin,
                destination: destination
            };
            console.log(`\t[${currentTime}]${result.customer.id} is requesting Taxi at`);
            return result;
        }
    }
    return {
        continue: false,
        customer: null,
        origin: null,
        destination: null
    };
}

function generateDailyTable(date, chanceTable, customers, taxis, func) {
    var results = [];

    for (var i = 0; i < times.length; i++) {
        var currentChanceByTime = time_chances[i];
        var currentTime = times[i];
        for (var min = 0; min < 60; min += 5) {
            var currentTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), times[i], min, 0);
            console.log(`***    ${currentTime.toLocaleString()}`);

            //  Is there anyone requesting a Taxi ?
            while (true) {
                var customerResult = findACustomer(customers, currentTime, currentChanceByTime);

                if (customerResult && customerResult.customer) {
                    var taxi = findAnAvailableTaxi(taxis, currentTime);
                    if (taxi) {
                        var distance = getDistance(customerResult.origin.coordinates.lat,
                            customerResult.origin.coordinates.lng,
                            customerResult.destination.coordinates.lat,
                            customerResult.destination.coordinates.lng);

                        console.log(`\t=> Total ${distance} km from ${JSON.stringify(customerResult.origin.coordinates)} to ${JSON.stringify(customerResult.destination.coordinates)}`);
                        updateCustomerStatus(customerResult.customer, currentTime, false, distance);
                        updateTaxiStatus(taxi, currentTime, distance);

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

var chanceTable = buildChanceTable(times, time_chances);
var customers = buildCustomers(50000);
var taxi = buildTaxis(1000);

// const TaxiManager = require('./TaxiManager.js');
// const CustomerManager = require('./CustomerManager.js');
// var taxisMgr = new TaxiManager(10000);
// var customersMgr = new CustomerManager(50000);

var start = new Date(process.argv[2]);
var end = new Date(process.argv[3]);
var moment = require('moment');

for (var m = moment(start); m.isBefore(end); m.add(1, 'days')) {
    const date = new Date(m.format('YYYY-MM-DD'));
    const fn = `./data/bookevents_${m.format('YYYY-MM-DD')}.json`;
    if (!fs.existsSync(fn)) {
        fs.writeFileSync(fn, '');
    }
    generateDailyTable(date, chanceTable, customers, taxi,
        (record) => {
            fs.appendFileSync(fn, JSON.stringify(record) + '\r\n', () => { });
        }
    );
    console.log(`successfully generated - ${fn}`);
}