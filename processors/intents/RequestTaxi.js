const {
    Image,
    BasicCard,
    Button,
    Confirmation,
    Suggestions
} = require('actions-on-google');
const SystemIntegrationManager = require('../SystemIntegrationManager.js');
const GoogleMap = require('../GoogleMap.js');
module.exports = {
    setup: async function (app) {
        app.intent('RequestTaxi', async (conv, params) => {
            console.log('====>RequestTaxi');
            console.log(JSON.stringify(conv));
            if (!conv.screen) {
                conv.ask('抱歉，你必須在手機上使用這個服務');
                return;
            }
            const config = {
                projectId: process.env.PROJECT_ID,
                location: process.env.LOCATION,
                key: process.env.MAP_KEY,
                date: params.date ? new Date(params.date) : null,
                time: params.time ? new Date(params.time) : null,
                location: `${params.location['city']} ${params.location['subadmin-area']} ${params.location['street-address']} ${params.location['business-name']}`,
            };
            console.log(`${JSON.stringify(config)}`);
            console.log(`You want to got to ${config.location} at ${config.time}`);

            const map = new GoogleMap(config);
            const coordinates = await map.getGeoCoordinates(config.location);
            console.log(`You want to got to [${(coordinates.lat)},${coordinates.lng}] at ${coordinates}`);
            conv.ask(`你要到 ${config.location}`);
            var fromLocation = conv.device.location.coordinates;
            var url = await map.getStaticMap(config.location, coordinates);
            console.log(`[Info]${url}`);
            
            //  Update context
            const lifespan = 5;
            const contextParameters = {
                destination: coordinates,
            };
            conv.contexts.set('RequestTaxi-followup', lifespan, contextParameters);
            console.log(`[INFO]===> Updated RequestTaxi-followup: ${JSON.stringify(contextParameters)}`);

            //https://actions-on-google.github.io/actions-on-google-nodejs/classes/conversation_helper.confirmation.html
            var card = new BasicCard({
                text: '以下是您的目的地位置資訊',
                title: '目的地',
                image: new Image({
                    url: url,
                    alt: '目的地'
                }),
                display: 'CROPPED',
            });
            console.log(`[Info]Card=${JSON.stringify(card)}`);
            
            //  Must have a simple response before sending cards in Google Assistant 
            //  per https://developers.google.com/assistant/conversational/responses#visual_selection_responses
            conv.ask(`以下是您的目的地資訊，確定要叫車嗎？`);
            conv.ask(card);
            conv.ask(new Suggestions(['是', '否']));
        });
        app.intent('Request_Confirmation_Yes', (conv) => {
            try{
                // conv.close(`已經為您叫車，車號: 1688-TW`);
                // return;
                console.log('=====>Request_Confirmation_Yes');
                console.log('Start Integration...');
                console.log('JSON=' + JSON.stringify({json:false, uri:process.env.LOCAL_SYSTEM_URL,method:'GET'}));
                const integrator = new SystemIntegrationManager({json:false, uri:process.env.LOCAL_SYSTEM_URL,method:'GET'});
                var plate = integrator.get(null);
                console.log('Done Integration...');
                //conv.close(`已經為您叫車，車號：1688-TW[${plate}]`);
                conv.close(`已經為您叫車，車號：${plate}`);
            }catch(ex){
                console.log(`[ERROR][Request_Confirmation_Yes]${ex}`);
            }
        });
    }
}