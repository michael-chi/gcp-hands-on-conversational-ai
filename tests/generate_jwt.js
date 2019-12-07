const {JWT} = require('google-auth-library');
const keys = require('../keys/service-account-key.json');
console.log(`key:${keys.private_key}/email:${keys.client_email}`)
async function main() {
  const client = new JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/cloud-platform'],
  );
  const tokenInfo = await client.getTokenInfo(client.credentials.access_token);
  
  //const url = `https://dialogflow-demo-api-fd5tyopnsa-an.a.run.app`;
  const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
  const tokenInfo = await client.getTokenInfo(client.credentials.access_token);
  
  const res = await client.request({url});
  console.log(res.data);
}

main().catch(console.error);