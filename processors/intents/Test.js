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
            if (!conv.screen) {
                conv.ask('抱歉，你必須在手機上使用這個服務');
                return;
            }
            //https://actions-on-google.github.io/actions-on-google-nodejs/classes/conversation_helper.confirmation.html
            var card = new BasicCard({
                text: 'TEST TEXT',
                subtitle: 'Test',
                title: '目的地',
                buttons: new Button({
                    title: `TEST BUTTON`,
                    url: process.env.TEST_URL,
                }),
                image: new Image({
                    url: process.env.TEST_URL,
                    alt: 'YOU ARE HERE'
                }),
                display: 'CROPPED',
            });
            console.log(`[Info]Card=${JSON.stringify(card)}`);
            //  Must have a simple response before sending cards in Google Assistant 
            //  per https://developers.google.com/assistant/conversational/responses#visual_selection_responses
            //conv.ask(new Confirmation('請問是否確定要叫車？'))
            conv.ask(`以下是您的目的地資訊，確定要叫車嗎？`);
            conv.ask(card);
            conv.ask(new Suggestions(['是', '否']));
        });

        //  Event:actions.intent.CONFIRMATION
        app.intent('TEST_CONFIRM', (conv, input) => {
            console.log('=====>TEST_CONFIRM');
            console.log(`[Info]conv=${JSON.stringify(conv)}`);
            if (conv.query == '是') {
                conv.close(`已經為您叫車，車號：1688-TW`);
            } else {
                conv.close(`希望下次有機會為您服務`);
            }
        });
    }
}