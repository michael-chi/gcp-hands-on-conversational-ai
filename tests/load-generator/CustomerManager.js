const addresses = require('./data/simulation_addresses.json');
const uuidv1 = require('uuid/v1');
const VIPs = [0, 1, 2];

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
module.exports = class CustomerManager {
    constructor(count){
        this.customers = this.buildCustomers(count);
    }
    buildCustomers(count) {
        var customers = [];//new Map();
        //  VIP
        for (var vip in VIPs) {
            customers.push({
                id: vip,
                chance: 1,
                available: true,
                unavailableUntil: null
            });
        }
        for (var i = VIPs.length + 1; i < count; i++) {
            customers.push({
                id: i,
                chance: Math.random(),
                available: true,
                unavailableUntil: null
            });
        }
        console.log(customers);
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
        customer.unavailableUntil = newTime;
        var i = 0;
        this.customers.find((c, index) => {
            if(c.id == customer.id){
                this.customers[index] = customer;
                i = index;
            }
        });
        console.log(`**** UPDATED ****\r\n${JSON.stringify(this.customers[i])}\r\n***************`);
            
    }

    _vip(c, isContinue){
        if(VIPs.find(e => e.id == c.customer.id)){
            console.log(`'====== Is VIP ======'`);
            return {
                continue: isContinue,  //last customer in the list
                customer: c.customer,
                origin: {
                    //25.0623418,121.2345442
                    //臺灣桃園國際機場/@25.0623418,121.2345442
                    "address": "臺北市中山區中山北路二段91號",
                    "coordinates": {
                        "lat": 25.059308,
                        "lng": 121.523262
                    }
                },
                destination: {
                    //25.0623418,121.2345442
                    //臺灣桃園國際機場/@25.0623418,121.2345442
                    "address": "臺灣桃園國際機場",
                    "coordinates": {
                        "lat": 25.0623418,
                        "lng": 121.2345442
                    }
                }
            };
        }else{
            return c;
        }
    }

    findACustomer(currentTime, currentChanceByTime) {
        //  Assumption: People is less likely to take TAXI on Sunday and Saturday
        var currentChangeOfTakingTaxiByTime = currentTime.getDay() == 0 ? currentChanceByTime / 4 : currentChanceByTime;
        currentChangeOfTakingTaxiByTime = currentTime.getDay() == 6 ? currentChanceByTime / 3 : currentChanceByTime;

        //  Is there anyone requesting a Taxi ?
        for (var k = 0; k < this.customers.length; k++) {
            var customer = this.customers[k];
            //  Update this customer's status
            if (customer.unavailableUntil <= currentTime) {
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
                var vip = this._vip(result, result.continue);
                console.log(`\t[${currentTime}]${result.customer.id} is requesting Taxi at`);
                return vip;
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