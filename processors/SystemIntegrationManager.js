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
        try{
            var result = await request(options);
            return result;
        }catch(ex){
            return "TW-1688";
        }
    }
}
module.exports = SystemIntegrationManager;