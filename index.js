'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const Translator = require('./processors/Translator');
const GetLanguageCode = require('./processors/LanguageCodeConverter');
const MetricsManager = require('./processors/MetricsManager');

process.env.DEBUG = 'dialogflow:debug';

exports.dialogflowFirebaseFulfillment = ((request, response) => {
    require('dotenv').config();
    console.log('=================');
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    const agent = new WebhookClient({ request, response });
    
    // function welcome (agent) {
    //   agent.add(`Welcome to my agent!`);
    // }
    // function fallback (agent) {
    //   agent.add(`I didn't understand`);
    //   agent.add(`I'm sorry, can you try again?`);
    // }
  
    async function intent_RequestTaxi(agent) {
      const config = {
          projectId: process.env.PROJECT_ID, 
          location: process.env.LOCATION,
          date: agent.parameters.date ? new Date(agent.parameters.date) : null,
          time: agent.parameters.time ? new Date(agent.parameters.time) : null,
          location: agent.parameters.location['street-address'] ? agent.parameters.location['street-address'] : agent.parameters.location['business-name'],
          keyFile: 'keys/service-account-key.json'
      };
      console.log(`You want to got to ${config.location} at ${config.time}`);
      agent.add(`You want to got to ${config.location} at ${config.time}`);
    }
    async function intent_RequestPermissions(agent){
        const conv = agent.conv();
        if(!conv.device)
        {
          conv.ask(`I need yout location`);
          conv.ask(new Suggestions([
            'Place'
          ]));
        }else{
          agent.add(`You are at ${conv.device}`);
        }
    }
    // app.intent('Permission', (conv, params, confirmationGranted) => {
    //   // Also, can access latitude and longitude
    //   // const { latitude, longitude } = location.coordinates;
    //   const {location} = conv.device;
    //   const {name} = conv.user;
    //   if (confirmationGranted && name && location) {
    //     conv.ask(`Okay ${name.display}, I see you're at ` +
    //       `${location.formattedAddress}`);
    //   } else {
    //     conv.ask(`Looks like I can't get your information.`);
    //   }
    //   conv.ask(`Would you like to try another helper?`);
    //   conv.ask(new Suggestions([
    //     'Confirmation',
    //     'DateTime',
    //     'Place',
    //   ]));
    // });

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('RequestTaxi', intent_RequestTaxi);
    intentMap.set('Default Welcome Intent',intent_RequestPermissions);
    agent.handleRequest(intentMap);
  });