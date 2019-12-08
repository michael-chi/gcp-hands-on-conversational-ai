const {
    dialogflow
} = require('actions-on-google');

require('dotenv').config()

const app = dialogflow();

const handlers = [];
//  Add Intent handlers below
handlers.push(require('./processors/intents/RequestTaxi.js'));
handlers.push(require('./processors/intents/DefaultWelcome.js'));
//handlers.push(require('./processors/intents/Test.js'));

handlers.forEach(element => {
    element.setup(app);
});

exports.agent = app;