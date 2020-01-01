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
            var result = await request(this.option);
            return result;
        }catch(ex){
            console.log(`${JSON.stringify(this.option)}`);
            return "TW-1688";
        }
    }
}
module.exports = SystemIntegrationManager;