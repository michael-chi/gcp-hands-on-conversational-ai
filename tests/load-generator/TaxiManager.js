const addresses = require('./data/simulation_addresses.json');
const uuidv1 = require('uuid/v1');

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
module.exports = class TaxiManager {
    constructor(count){
        this.taxis = this.buildTaxis(count);
    }
    

    updateTaxiStatus(taxi, currentTime, distance) {
        //  Take 1 hour for this customer, update Taxi
        taxi.available = false;

        var newTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(),
            currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());


        newTime.setMinutes(currentTime.getMinutes() + distance * 7);    //  roughly 7 minutes for 1 km
        taxi.unavailableUntil = newTime;//new Date(newTime);
        this.taxis.find((c, index) => {
            if(c.plate == taxi.plate){
                this.taxis[index] = taxi;
            }
        })
        return taxi;
    }
    getRandomPlateText(len) {
        var emptyString = "";
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
        while (emptyString.length < len) {
            emptyString += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return emptyString;
    }
    getNextAvailableTaxi(taxis, currentTime) {
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
    
    buildTaxis(count) {
        var map = [];//new Map();
        for (var i = 0; i < count; i++) {
            var plateNoNumber = Math.floor(Math.random() * 9999).toString().padStart(4, '9');
            var plateNoText = this.getRandomPlateText(2);
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
        var taxi = this.getNextAvailableTaxi(this.taxis, currentTime);
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