####    Enable Translation API

-   到[GCP Console](https://console.cloud.google.com), API & Services, Library找到Cloud Translation API並確認已經Enable

<img src="./img/enable-translation-api.png"/>

####    Create DialogFlow API Layer

在這裡我要用Node.JS寫一個REST API，這個API會提供給Dialog Flow呼叫來翻譯使用者的語句．目前Cloud Functions提供的[Runtime環境](https://cloud.google.com/functions/docs/concepts/exec)為Node.JS 8, 10 (BETA), Go與Python．在此我使用Node.JS 10的版本．

-   部署到 Cloud Functions，注意以下的參數中<Function Name>必須為index.js中export的函式名稱；以這個例子來說，為dialogflowFirebaseFulfillment

```bash
gcloud functions deploy <Function Name> --runtime nodejs10 --trigger-http --service-account kalschi-dialogflow-serviceacco@kalschi-demo-001.iam.gserviceaccount.com
```
<img src="doc/img/cf-service-account-config.jpg"/>
