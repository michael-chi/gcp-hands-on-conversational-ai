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
  
    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('RequestTaxi', intent_RequestTaxi);
    agent.handleRequest(intentMap);
  });