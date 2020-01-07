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
            try{
                // conv.close(`已經為您叫車，車號: 1688-TW`);
                // return;
                var plate = null;
                console.log('=====>Request_Confirmation_Yes');
                console.log('Start Integration...');
                console.log('JSON=' + JSON.stringify({json:false, uri:process.env.LOCAL_SYSTEM_URL,method:'GET'}));
                const integrator = new SystemIntegrationManager({json:false, uri:process.env.LOCAL_SYSTEM_URL,method:'GET'});
                plate = integrator.get(null);
                console.log('Done Integration...');
                if(!plate){
                    plate = 'TW-1688';
                }
                conv.close(`已經為您叫車，車號：${plate}`);
            }catch(ex){
                console.log(`[ERROR][Request_Confirmation_Yes]${ex}`);
            }
        });
    }
}