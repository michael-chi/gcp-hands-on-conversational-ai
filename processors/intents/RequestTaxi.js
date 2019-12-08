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
        app.intent('RequestTaxi', async (conv, params) => {
            console.log('====>Request Taxi');
            console.log(JSON.stringify(conv));
            const config = {
                projectId: process.env.PROJECT_ID,
                location: process.env.LOCATION,
                key: process.env.MAP_KEY,
                date: params.date ? new Date(params.date) : null,
                time: params.time ? new Date(params.time) : null,
                location: params.location['street-address'] ?
                    params.location['street-address'] :
                    params.location['business-name'],
                keyFile: 'keys/service-account-key.json'
            };
            console.log(`You want to got to ${config.location} at ${config.time}`);
            const map = new GoogleMap(config);
            const coordinates = await map.getGeoCoordinates(config.location);
            console.log(`You want to got to [${(coordinates.lat)},${coordinates.lng}] at ${coordinates}`);
            conv.ask(`你要到 ${config.location}，座標:[${(coordinates.lat)},${coordinates.lng}] 在 ${config.time}`);

            var fromLocation = conv.device.location.coordinates;
            var url = await map.getStaticMap(config.location, coordinates);
            console.log(`[Info]${url}`);
            //https://actions-on-google.github.io/actions-on-google-nodejs/classes/conversation_helper.confirmation.html
            var card = new BasicCard({
                subtitle: `${config.location}`,
                title: '目的地',
                buttons: new Button({
                    title: `${config.location}`,
                    url: url,
                }),
                image: new Image({
                    url: url,
                    alt: `${config.location}`
                }),
                display: 'CROPPED',
            });
            console.log(`[Info]Card=${JSON.stringify(card)}`);
            conv.ask(card);
            //conv.ask(new Confirmation('請問是否確定要叫車？'))
        });
        app.intent('actions.intent.CONFIRMATION', (conv, input, confirmation) => {
            if (confirmation) {
                conv.close(`已經為您叫車，車號：1688-TW`);
            } else {
                conv.close(`希望下次有機會為您服務`);
            }
        });
    }
}