##  Overview

除了使用Kubernetes部署服務，我在這裡會使用Cloud Run來作為Fulfillment API端執行環境

####    Deploy to Cloud Run

-   在先前的步驟中，我已經建立了Docker image，因此在這裡我只需要使用以下的指令將image部署到新建立的Cloud Run環境即可。
    
    為了測試方便，當系統詢問是否要允許匿名存取時，先回答Y

    另外，Cloud Run預設使用Port 8080，如有必要也需要修改程式

```bash
gcloud beta run deploy <NAME> --image <GCR/IMAGE> --platform managed --region asia-northasia1 \
    --set-env-vars PROJECT_ID=<PROJECT_ID>,LOCATION=global --service-account <SVC ACCT>
# gcloud beta run deploy dialogflow-demo-api --image asia.gcr.io/kalschi-demo-001/conversational-ai-demo:latest --platform managed --region asia-northeast1 --set-env-vars PROJECT_ID=kalschi-demo-001,LOCATION=global --service-account kalschi-dialogflow-serviceacco@kalschi-demo-001.iam.gserviceaccount.com
```