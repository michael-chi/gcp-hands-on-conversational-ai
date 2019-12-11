##  Overview

接下來我要建立一個Dataflow Pipeline把Pub/Sub中的叫車事件寫到BigQuery中

####    事件格式

-   在我的範例中，前端會傳回以下的事件到Pub/Sub Topic中

```json
{
    "conversationId": "xxx",
    "time": "2019-12-11T10:00:21.000000Z+8:00",
    "from": {
        "coordinates": {
            "latitude": 234.123,
            "longitude": 567.876
        },
        "address": "xxx"
    },
    "to": {
        "coordinates": {
            "latitude": 234.123,
            "longitude": 567.876
        },
        "address": "xxx"
    }
}
```

-   我預先建立了一個[BigQuery Table定義檔](./schema-bq.json)

####    建立BigQuery Table

-   先建立BigQuery Dataset

```bash
bq --location=asia-east1 mk --dataset --description 'Dialogflow Demo' kalschi-demo-001:conversational_ai_anaytics
```

-   用上面建立的定義檔來建立Table

<img src="./img/bq-create-table.png" style="width:40%;height:30%"/>

-   建立完成後應該會看到下面的結構

<img src="./img//bq-table.png" style="width:40%;height:30%"/>


####    建立Dataflow Pipeline


-   先建立一個供Dataflow暫存資料的暫存區

```bash
gsutil mb gs://kalschi-temp
```

-   我直接利用Google Cloud Dataflow預先建立好的Pub/Sub到BigQuery的Flow template來建立我的Data pipeline

    -   Pub/Sub Subscrption名稱格式為projects/<PROJECT_ID>/subscriptions/<SUBSCRIPTION_NAME>
    
    -   BigQuery output Table名稱格式為<PROJECT_ID>:<DATASET_NANE>.<TABLE_NAME>

<img src="./img/dataflow-create-from-template.png" style="width:40%;height:30%"/>

-   為我們為專案建立的的Service Account賦予Dataflow Worker權限

<img src="./img/iam-dataflow-workder.png" style="width:40%;height:30%"/>

-   指定Service Account為我們為專案建立的的Service Account

<img src="./img/dataflow-service-account.png" style="width:40%;height:30%"/>

-   回到Pub/Sub Subscription，設定Dataflow權限給Service Account

<img src="./img/pubsub-subscription-service-account.png" style="width:40%;height:30%"/>
