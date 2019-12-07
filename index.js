const {
  dialogflow,
  Suggestions,
  Permission,
  Carousel,
  Image,
  Table,
  List,
} = require('actions-on-google');

const functions = require('firebase-functions');
// Create an app instance
const app = dialogflow();
// Register handlers for Dialogflow intents
app.intent('RequestTaxi', (conv, params) => {
  console.log('====>Request Taxi');
  console.log(JSON.stringify(conv));
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

app.intent('Default Welcome Intent', (conv) => {
  const permissions = ['NAME'];
  //let context = 'To address you by name';
  // Location permissions only work for verified users
  // https://developers.google.com/actions/assistant/guest-users
  if (conv.user.verification === 'VERIFIED') {
    // Could use DEVICE_COARSE_LOCATION instead for city, zip code
    permissions.push('DEVICE_PRECISE_LOCATION');
    //context += ' and know your location';
  }
  const options = {
    context,
    permissions,
  };
  conv.ask(new Permission(options));
});
app.intent('Permission Handler', (conv, params, confirmationGranted) => {
  // Also, can access latitude and longitude
  // const { latitude, longitude } = location.coordinates;
  const {location} = conv.device;
  const {name} = conv.user;
  if (confirmationGranted && name && location) {
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

app.intent('Default Welcome Intent 2', (conv, params, confirmationGranted) => {
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