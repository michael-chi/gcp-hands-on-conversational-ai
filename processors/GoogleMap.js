//import { throws } from "assert";
const fetch = require("node-fetch");

class GoogleMap {

    constructor(config) {
        this.MAPAPI_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
        this.config = config;
    };

    async httpGet(url) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json;
        } catch (error) {
            console.log(`[Error]${error}`);
        }
    };
    async httpGetRaw(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            return text();
        } catch (error) {
            console.log(`[Error]${error}`);
        }
    };
    async getStaticMap(address, coordinates){
        const location = encodeURIComponent(address);
        const STATIC_MAP_URL = 'https://maps.googleapis.com/maps/api/staticmap?center=';
        const url = `${STATIC_MAP_URL}${encodeURIComponent(address)}&size=600x300&zoom=16&maptype=roadmap&markers=color:red%7Clabel:D%7C${coordinates.lat},${coordinates.lng}&key=${this.config.key}`;

        return url;
    }
    //https://developers.google.com/maps/documentation/geocoding/intro
    async getGeoCoordinates(human_readable_location) {
        const location = encodeURIComponent(human_readable_location);
        const request = `${this.MAPAPI_URL}${location}&key=${this.config.key}`;
        console.log(request);
        var json = await this.httpGet(request);
        //var json = JSON.parse(text);
        try {
            return json.results[0].geometry.location;
        } catch (ex) {
            console.log(`[ERROR]Cannot get geo coordinates for ${human_readable_location}`);
            console.error(`[Error]${ex}`);
            return null;
        }
    }
    async getDistance(origin, destiontion){
        const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=$ORIGIN&destinations=$DEST&key=$KEY'
        const request = url.replace('$KEY', this.config.key).replace('$ORIGIN',`${origin.lat},${origin.lng}`).replace('$DEST',`${destiontion.lat},${destiontion.lng}`);
        console.log(request);
        //result = await this.httpGet(encodeURIComponent(request));
        var result = await this.httpGet(request);
        return result.rows[0].elements[0].distance.value / 1000;
    }
}

module.exports = GoogleMap;
