const request = require("request-promise");
var api_url = 'https://google.com';

async function main(){
    var options = {
        uri: api_url,
        method: "GET"
    }
    var result = await request(options);
    console.log(result);
}
main().then((t) => {});