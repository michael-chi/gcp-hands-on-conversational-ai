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
const SystemIntegrationManager = require('../SystemIntegrationManager.js');
module.exports = {
    setup: function (app) {
        app.intent('TEST', (conv, input) => {
            try {
                console.log('=====>Request_Confirmation_Yes');
                console.log('[Info]Start Integration...');
                const integrator = new SystemIntegrationManager({ json: false, uri: process.env.LOCAL_SYSTEM_URL, method: 'GET' });
                console.log('[Info]JSON=' + JSON.stringify({ json: false, uri: process.env.LOCAL_SYSTEM_URL, method: 'GET' }));
                var plate = integrator.get(null);
                console.log('[Info]Done Integration...');
                //conv.close(`已經為您叫車，車號：1688-TW[${plate}]`);
                conv.close(`已經為您叫車，車號：${plate}`);
            } catch (ex) {
                console.log(`[ERROR][TEST]${ex}`);
                console.error(`[ERROR][TEST]${ex}`);
            }
        });
    }
}