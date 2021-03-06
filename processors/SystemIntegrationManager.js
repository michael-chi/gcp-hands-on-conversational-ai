const request = require("request-promise");
var node = require("deasync");

// Wait for a promise without using the await
function wait(promise) {
    var done = 0;
    var result = null;
    promise.then(
        // on value
        function (value) {
            done = 1;
            result = value;
            return (value);
        },
        // on exception
        function (reason) {
            done = 1;
            throw reason;
        }
    );

    while (!done)
        node.runLoopOnce();

    return (result);
}
class SystemIntegrationManager {
    /*
    uri: request uri
    method: HTTP verbs
    json: true|false
    */
    constructor(option) { 
        this.option = option;
    }

    get(text) {
        console.log(`[INTEGRATION]${JSON.stringify(this.option)}`);

        try{
            if(this.option && this.option.uri && this.option.uri != ''){
                console.log(`[INFO]${this.option.uri} specified, invoking...`);
                var task = request(this.option);
                return wait(task);
            }
            else
            {
                console.log(`[INFO]No url specified, using defaults`);
                return "TW-1688";
            }
        }catch(ex){
            console.error(`[Exception]Error invoking on-prem:${ex}`);
            return "TW-1688";
        }
    }
}
module.exports = SystemIntegrationManager;