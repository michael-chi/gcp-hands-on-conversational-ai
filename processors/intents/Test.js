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
            const integrator = new IntegrationManager({json:false, uri:process.env.LOCAL_SYSTEM_URL,method:'GET'});
            var plate = await integrator.get(null);
            conv.ask(plate);
        });
    }
}