import { throws } from "assert";
const fetch = require("node-fetch");

class GoogleMapManager {

    constructor(config) {
        this.MAPAPI_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        this.config = config;
    };

    async httpGet(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.log(error);
        }
    };

    async getGeoCoordinates(human_readable_location) {
        var text = await this.httpGet(`${this.MAPAPI_URL}${human_readable_location}&key=${this.config.key}`)
        var json = JSON.parse(text);
        try {
            return json.results[0].geometry.location;
        } catch (ex) {
            return null;
        }
    }
}

module.exports = GoogleMap;
