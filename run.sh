git pull
docker build . -t kalschi/conversational-ai-demo:latest
docker tag kalschi/conversational-ai-demo:latest asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest
docker push asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest
kubectl rollout restart deployment/dialogflow-fulfillment