const {
  dialogflow,
  Image,
} = require('actions-on-google');

const functions = require('firebase-functions');
// Create an app instance
const app = dialogflow();
// Register handlers for Dialogflow intents
app.intent('RequestTaxi', (conv, params) => {
  console.log('====>REquest Taxi');
  const config = {
      //projectId: process.env.PROJECT_ID, 
      //location: process.env.LOCATION,
      date: params.date ? new Date(params.date) : null,
      time: params.time ? new Date(params.time) : null,
      location: params.location['street-address'] ? 
                              params.location['street-address'] : 
                              params.location['business-name'],
      keyFile: 'keys/service-account-key.json'
  };  
  console.log(`You want to got to ${config.location} at ${config.time}`);
  conv.ask(`You want to got to ${config.location} at ${config.time}`);
});

app.intent('Default Welcome Intent', (conv, params, confirmationGranted) => {
      // Also, can access latitude and longitude
      // const { latitude, longitude } = location.coordinates;
  console.log('======> here');
      const {location} = conv.device;
      //const {name} = conv.user;
      if (confirmationGranted && location) {
        conv.ask(`Okay ${name.display}, I see you're at ` +
          `${location.formattedAddress}`);
      } else {
        conv.ask(`Looks like I can't get your information.`);
      }
      conv.ask(`Would you like to try another helper?`);
      conv.ask(new Suggestions([
        'Confirmation',
        'DateTime',
        'Place',
      ]));
    });
exports.agent = app;
//exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);