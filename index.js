const {
    dialogflow
} = require('actions-on-google');

require('dotenv').config()

const app = dialogflow();

//  Add Intent handlers below
const handlers = [];
handlers.push(require('./processors/intents/OnboardingProcess.js'));

//  Setup Intent Handlers
handlers.forEach(element => {
    element.setup(app);
});

exports.agent = app;