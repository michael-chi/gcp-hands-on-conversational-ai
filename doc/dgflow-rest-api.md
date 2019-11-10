##  Create a REST API with Express

既然程式已經在Cloud Functions上驗證可行，接下來我要把程式移植到Kubernets上．首先，我使用Express建立一個簡單的REST API並在本機上確認可執行．

-   在Package.json中加入Express

```json
  "dependencies": {
    "express": "*", //...
  }
```

-   建立一個新檔案名為app.js作為入口，代碼如下；

```javascript
var dialogflowFirebaseFulfillment = require('./index').dialogflowFirebaseFulfillment;
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(function (req, res) {
    dialogflowFirebaseFulfillment(req,res);
})

app.listen(3000);

console.log('listening on http://localhost:3000');
```

-   在本機執行測試

```bash
node app
```

-   使用POSTMAN或其他REST API測試工具對http://localhost:3000 POST以下內容

```json
{
  "responseId": "xxxxxxxx-fbfd-457a-95fa-5ba802ebf58d-b81332aa",
  "queryResult": {
    "queryText": "我愛你的日文怎麼說",
    "parameters": {
      "translate_target_language": "日文",
      "translate_target_script": "我愛你"
    },
    "allRequiredParamsPresent": true,
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            ""
          ]
        }
      }
    ],
    
    "intent": {
      "displayName": "intent_translate"
    },
    "intentDetectionConfidence": 1,
    "languageCode": "zh-tw"
  },
  "originalDetectIntentRequest": {
    "payload": {}
  }
}
```

    應該要可以看到如下的回應

```json
{
    "fulfillmentText": "愛してる",
    "outputContexts": []
}
```