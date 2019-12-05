##  Overview

我在這裡會使用Cloud Run來作為Fulfillment API端執行環境

####    Deploy to Cloud Run

```bash
# gcloud beta run deploy test2 --image asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest --platform managed --region asia-northeast1 --set-env-vars PROJECT_ID=kalschi-demo-001,LOCATION=global
```