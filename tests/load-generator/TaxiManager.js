const addresses = require('./data/simulation_addresses.json');
const uuidv1 = require('uuid/v1');

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
module.exports = class TaxiManager {
    constructor(count){
        this.taxis = this.buildTaxis(count);
    }
    getRandomPlateText(len) {
        var emptyString = "";
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        while (emptyString.length < len) {
            emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return emptyString;
    }

    updateTaxiStatus(taxi, currentTime, distance) {
        //  Take 1 hour for this customer, update Taxi
        taxi.available = false;

        var newTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(),
            currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());


        newTime.setMinutes(currentTime.getMinutes() + distance * 7);    //  roughly 7 minutes for 1 km
        taxi.unavailableUntil = newTime;//new Date(newTime);

        return taxi;
    }

    buildTaxis(count) {
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
    findAnAvailableTaxi(currentTime) {
        var taxi = getNextAvailableTaxi(this.taxis, currentTime);
        if (!taxi) {
            console.log(`No available Taxi found`);
            return null;
        } else if (taxi &&
            taxi.chance * Math.random() >= Math.random() * Math.random()) {
            console.log(`Taxi ${taxi.plate} take customer`);
            return taxi;
        }
    }
}