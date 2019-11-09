## Overview

為了學習GCP，我會以實作一個Google Assistant應用作為練習；在這個練習中，我會先以Dialog Flow製作基本的對話機器人的對話機制，透過Cloud Function呼叫Translation API讓機器人可以翻譯使用者輸入的文字．

接著我會把Cloud Function改為GKE以Container方式包裝我的後端服務，然後部署到GKE上，並設置相關的防火牆規則等．在過程中，如果有遇到覺得有疑問或可能有其他做法的地方，我會把它列在[這裡](./to-be-investigated.md)

####    [Environment Setup](doc/env-setup.md)

####    [Create DialogFlow Agent](doc/dgflow-create-agent.md)

####    [DialogFlow API Local Test and Deploy to Cloud Functions](doc/dgflow-cloud-finctions.md)

-   Roles

<img src="doc/img/iam-role-cf-df.jpg"/>



## Kubernetes Cluster

https://blog.johnwu.cc/article/gcp-kubernetes-connect-to-cloudsql.html

https://github.com/GoogleCloudPlatform/kubernetes-bigquery-python/blob/master/pubsub/pubsub-pipe-image/utils.py#L37

https://cloud.google.com/docs/authentication/production?hl=zh-tw

```shell
gcloud container clusters create dialogflow-fulfillment --zone asia-east1-a --machine-type n1-standard-1 --max-nodes 1

// verify:
//  docker run -p 33333:3000 kalschi/gcp-df-test:1.00

docker build . -t kalschi/gcp-df-test:1.00

docker push kalschi/gcp-df-test:1.00  


kubectl apply -f ./df-deployment.yaml
kubectl apply -f ./df-service.yaml


kubectl get services

// verify:
//  wget http://<EXTERNAL IP>:33333


// TODO:
//  Need to find out how to use gcloud service account in K8s cluster
//  https://ithelp.ithome.com.tw/articles/10195944
//  https://cloud.google.com/kubernetes-engine/docs/tutorials/authenticating-to-cloud-platform?hl=zh-tw

//  IAM: https://cloud.google.com/kubernetes-engine/docs/tutorials/authenticating-to-cloud-platform?hl=zh-tw
```

