const request = require("request-promise");

class SystemIntegrationManager {
    /*
    uri: request uri
    method: HTTP verbs
    json: true|false
    */
    constructor(option) { 
        this.option = option;
    }
    async get(text) {
        var result = await request(options);

        return result;
    }
}
module.exports = SystemIntegrationManager;