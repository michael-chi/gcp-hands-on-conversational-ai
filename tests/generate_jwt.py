# Requests is already installed, no need to add it to requirements.txt
import requests


# Set up metadata server request
# See https://cloud.google.com/compute/docs/instances/verifying-instance-identity#request_signature
metadata_server_token_url = 'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience='
receivingServiceURL = 'https://dialogflow-demo-api-fd5tyopnsa-an.a.run.app/';

token_request_url = metadata_server_token_url + receiving_service_url
token_request_headers = {'Metadata-Flavor': 'Google'}

# Fetch the token
token_response = requests.get(token_request_url, headers=token_request_headers)
jwt = token_response.content.decode("utf-8")

print jwt
exit(0)
# Provide the token in the request to the receiving service
# receiving_service_headers = {'Authorization': f'bearer {jwt}'}
# service_response = requests.get(receiving_service_url, headers=receiving_service_headers)

# return service_response.content
    