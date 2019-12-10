const {
    dialogflow
} = require('actions-on-google');

require('dotenv').config()

const app = dialogflow();

//  Add Intent handlers below
const handlers = [];
handlers.push(require('./processors/intents/RequestTaxi.js'));
handlers.push(require('./processors/intents/DefaultWelcome.js'));
//handlers.push(require('./processors/intents/Test.js'));

//  Add Middlewares below
const middlewares = [];
middlewares.push(require('./processors/middlewares/BigdataMiddleware.js'));

//  Setup Intent Handlers
handlers.forEach(element => {
    element.setup(app);
});


//  Setup Middlewares
middlewares.forEach(middleware => {
    middleware.setup(app);
});
exports.agent = app;