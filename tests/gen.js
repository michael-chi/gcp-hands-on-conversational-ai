// Make sure to `npm install --save request-promise` or add the dependency to your package.json
const request = require('request-promise');

const receivingServiceURL = 'https://dialogflow-demo-api-fd5tyopnsa-an.a.run.app';

// Set up metadata server request
//https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
// See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
const metadataServerTokenURL = 'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=';
const tokenRequestOptions = {
    uri: metadataServerTokenURL + receivingServiceURL,
    headers: {
        'Metadata-Flavor': 'Google'
    }
};

// Fetch the token, then provide the token in the request to the receiving service
request(tokenRequestOptions)
  .then((token) => {
      console.log(token);
    //return request(receivingServiceURL).auth(null, null, true, token)
  })
  .then((response) => {
      console.log(response);
    //res.status(200).send(response);
  })
  .catch((error) => {
      console.error(error);
    //res.status(400).send(error);
  });
    