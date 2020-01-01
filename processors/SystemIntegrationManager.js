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
        console.log(`[INTEGRATION]${JSON.stringify(this.option)}`);
        if(!this.option || !this.option.uri || this.option.uri == ''){
            return "TW-1688";
        }

        try{
            var result = await request(this.option);
            return result;
        }catch(ex){
            console.error(`[Exception]Error invoking on-prem:${ex}`);
            return "TW-1688";
        }
    }
}
module.exports = SystemIntegrationManager;