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
    
    function welcome (agent) {
      agent.add(`Welcome to my agent!`);
    }
  
    function fallback (agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }
  
    async function intent_translate(agent) {
        const config = {
            projectId: process.env.PROJECT_ID, 
            location: process.env.LOCATION,
            targetLanguageCode: GetLanguageCode(agent.parameters.translate_target_language),
            keyFile: 'keys/service-account-key.json'
        };
        var translator = new Translator(config);
        var metrics = new MetricsManager(config);
        console.log('===> createTargetLanguageMetric() <===');
        //await metrics.createTargetLanguageMetric();
        await metrics.opencensusTargetLanguage(config.targetLanguageCode);
        
        var v = await translator.translateText(agent.parameters.translate_target_script);
        //await metrics.targetLanguage(config.targetLanguageCode);
        console.log('===> targetLanguage() <===');
        agent.add(v);
    }
    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function yourFunctionHandler(agent) {
    //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase inline editor!`);
    //   agent.add(new Card({
    //       title: `Title: this is a card title`,
    //       imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
    //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //       buttonText: 'This is a button',
    //       buttonUrl: 'https://docs.dialogflow.com/'
    //     })
    //   );
    //   agent.add(new Suggestion(`Quick Reply`));
    //   agent.add(new Suggestion(`Suggestion`));
    //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    // }
  
    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!'); // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
  
    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('intent_translate', intent_translate);
    // intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
    // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
    agent.handleRequest(intentMap);
  });