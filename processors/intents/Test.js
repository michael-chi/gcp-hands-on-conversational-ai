const {
    dialogflow,
    Suggestions,
    Permission,
    Image,
    BasicCard,
    Button,
    Confirmation
} = require('actions-on-google');

const GoogleMap = require('../GoogleMap.js');
module.exports = {
    setup: function (app) {
        app.intent('TEST', async (conv, input) => {
            console.log('=====>Request_Confirmation_Yes');
            console.log(`[Info]conv=${JSON.stringify(conv)}`);
            console.log('Start Integration...');
            const integrator = new IntegrationManager({json:false, uri:process.env.LOCAL_SYSTEM_URL,method:'GET'});
            console.log('JSON=' + JSON.stringify({json:false, uri:process.env.LOCAL_SYSTEM_URL,method:'GET'}));
            var plate = await integrator.get(null);
            console.log('Done Integration...');
            //conv.close(`已經為您叫車，車號：1688-TW[${plate}]`);
            conv.close(`已經為您叫車，車號：${plate}`);
        });
    }
}