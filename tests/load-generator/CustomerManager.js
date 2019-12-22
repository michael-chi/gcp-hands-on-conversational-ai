const addresses = require('./data/simulation_addresses.json');
const uuidv1 = require('uuid/v1');
const VIPs = [9000001, 9000002];

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
module.exports = class CustomerManager {
    constructor(count){
        this.customers = this.buildCustomers(count);
    }
    buildCustomers(count) {
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

    updateCustomerStatus(customer, currentTime, isAvailable, distance) {
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
    findACustomer(currentTime, currentChanceByTime) {
        //  Assumption: People is less likely to take TAXI on Sunday and Saturday
        var currentChangeOfTakingTaxiByTime = currentTime.getDay() == 0 ? currentChanceByTime / 4 : currentChanceByTime;
        currentChangeOfTakingTaxiByTime = currentTime.getDay() == 6 ? currentChanceByTime / 3 : currentChanceByTime;

        //  Is there anyone requesting a Taxi ?
        for (var k = 0; k < this.customers.length; k++) {
            var customer = this.customers[k];
            //  Update this customer's status
            if (customer.unavailableUntil >= currentTime) {
                customer.available = true;
                //customers.set(v.id, v);
                this.customers[k] = customer;
            }
            if (customer.available && customer.chance >= Math.random() && currentChangeOfTakingTaxiByTime >= Math.random()) {
                //  I need a Taxi now
                console.log(`${customer.id} is requesting Taxi...`);
                const origin = addresses[random(addresses.length)];
                const destination = addresses[random(addresses.length)];
                //console.log(`from ${JSON.stringify(origin)} to ${JSON.stringify(destination)}\r\ncontinue:${}<=${}:${k <= customers.length}`);

                var result = {
                    continue: (k <= this.customers.length),  //last customer in the list
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
}