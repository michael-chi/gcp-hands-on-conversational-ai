const fs = require('fs');

const newtaipei = require('./data/result_newtaipei.json');
const taipei = require('./data/result_taipei.json');
const taoyuan = require('./data/result_taoyuan.json');

const times = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1];
const time_chances = [0.03, 0.05, 0.2, 0.3, 0.5, 0.6, 0.5, 0.4, 0.5, 0.6, 0.6, 0.6, 0.4, 0.4, 0.7, 0.7, 0.6, 0.8, 0.5, 0.5, 0.02, 0.02]


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
function updateTaxi(taxis, plate, newState) {
    var index = -1;
    for (var i = 0; i < taxis.length; i++) {
        if (taxis[i].plate == plate) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        taxis[index] = newState;
    }
    return taxis;
}
function updateCustomer(customers, id, newState) {
    var index = -1;
    for (var i = 0; i < customers.length; i++) {
        if (customers[i].id == id) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        customers[index] = newState;
    }
    return customers;
}
function getNextAvailableTaxi(taxis, currentTime) {
    var result = null;
    for (var i = 0; i < taxis.length; i++) {
        var v = taxis[i];
        if (v.unavailableUntil && v.unavailableUntil <= currentTime) {
            console.log('Updating Taxi status...');
            v.available = true;
            v.unavailableUntil = null;
        }
        if (v.available && v.chance > Math.random()) {
            console.log(`${v.plate} is available!`);
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

function generateDailyTable(date, chanceTable, customers, taxis) {
    var results = [];

    for (var i = 0; i < times.length; i++) {
        var value = time_chances[i];
        var key = times[i];
        for (var min = 0; min < 60; min += 5) {
            var currentTime = new Date(date.getFullYear(), date.getMonth(), date.getDay(), key, min, 0);
            var currentChangeOfTakingTaxiByTime = value;
            //  Is there anyone requesting a Taxi ?
            for (var k = 0; k < customers.length; k++) {
                v = customers[k];
                console.log(`[${currentTime}]Start simulating customer ${v.id}`);
                //  Update this customer's status
                if (v.unavailableUntil >= currentTime) {
                    v.available = true;
                    //customers.set(v.id, v);
                    customers[k] = v;
                }
                if (v.available && v.chance >= Math.random() && currentChangeOfTakingTaxiByTime >= Math.random()) {
                    //  I need a Taxi now
                    console.log(`${v.id} is requesting Taxi...`);
                    var taxi = getNextAvailableTaxi(taxis, currentTime);
                    if (!taxi) {
                        console.log(`No available Taxi found`);
                    } else if (taxi &&
                        taxi.chance * Math.random() >= Math.random() * Math.random()) {
                        console.log(`found an available Taxi:${taxi.plate} for ${v.id} at ${currentTime}`);

                        //  Got a Taxi
                        console.log(`Taxi ${taxi.plate} take customer ${v.id}`);
                        //  Generate result record
                        var result = {
                            time: currentTime,
                            customer: k,
                            plate: taxi.plate
                        };
                        results.push(result);
                        //  Take 1 hour for this customer, update Taxi
                        taxi.available = false;
                        var newTime = currentTime.setMinutes(currentTime.getMinutes() + 60);
                        taxi.unavailableUntil = new Date(newTime);
                        updateTaxi(taxis, taxi.plate, taxi);

                        console.log(`Updated status of Taxi[${taxi.plate}] to unavailable till ${taxi.unavailableUntil}`);
                        //  Update Cutomer
                        v.available = false;
                        newTime = currentTime.setMinutes(currentTime.getMinutes() + 60 * Math.random(3));
                        v.unavailableUntil = new Date(newTime);
                        //customers.set(v.id, v);
                        updateCustomer(customers, v.id, v);
                    }
                }
            }
        }
    }
    return results;
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
var customers = buildCustomers(12561);
var taxi = buildTaxis(876);

var results = generateDailyTable(new Date(2019, 1, 1), chanceTable, customers, taxi);
fs.writeFile('./data/output.json', JSON.stringify(results), () => { });
console.log(`>> Result <<\r\n${JSON.stringify(results)}`);