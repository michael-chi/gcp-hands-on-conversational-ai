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
        app.intent('Test', async (conv, params) => {
            console.log('====>Test');
            console.log(JSON.stringify(conv));
            //https://actions-on-google.github.io/actions-on-google-nodejs/classes/conversation_helper.confirmation.html
            var card = new BasicCard({
                subtitle: 'Test',
                title: '目的地',
                buttons: new Button({
                    title: `TEST BUTTON`,
                    url: url,
                }),
                image: new Image({
                    url: process.env.TEST_URL,
                    alt: 'YOU ARE HERE'
                }),
                display: 'CROPPED',
            });
            console.log(`[Info]Card=${JSON.stringify(card)}`);
            conv.ask(card);
            //conv.ask(new Confirmation('請問是否確定要叫車？'))
        });

        //  Event:actions.intent.CONFIRMATION
        app.intent('TEST_CONFIRM', (conv, input, confirmation) => {
            if (confirmation) {
                conv.close(`已經為您叫車，車號：1688-TW`);
            } else {
                conv.close(`希望下次有機會為您服務`);
            }
        });
    }
}