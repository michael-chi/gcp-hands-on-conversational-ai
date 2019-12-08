const {
    dialogflow,
    Suggestions,
    Permission,
    Carousel,
    Image,
    Table,
    List,
    BasicCard,
    Button,
    Confirmation
} = require('actions-on-google');

require('dotenv').config()

const GoogleMap = require('./processors/GoogleMap.js');
const app = dialogflow();

const handlers = [];
//  Add Intent handlers below
handlers.push(require('./processors/intents/RequestTaxi.js'));
handlers.push(require('./processors/intents/DefaultWelcome.js'));

handlers.forEach(element => {
    element.setup(app);
});

exports.agent = app;