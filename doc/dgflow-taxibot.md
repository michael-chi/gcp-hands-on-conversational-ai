## Create Dialogflow Agent

為了更進一步了解Dialogflow與Actions on Google的整合, 我將原本的Agent修改如下


####    Flow diagram

-   在對話開始時要求使用者位置資訊

```mermaid
sequenceDiagram

User ->> Google Assistant: Hello
Google Assistant ->> Dialogflow: Welcome Intent
Dialogflow ->> Fulfillment: Webhook
Fulfillment -->> Dialogflow: Request Permissions
Dialogflow -->> Google Assistant: Request Permissions
Google Assistant -->> User: Request Permissions
User ->> Google Assistant: Grant Permissions 
```

-   要求使用者提供目的地資訊

```mermaid
sequenceDiagram

User ->> Google Assistant: Provide Destination Info
Google Assistant ->> Dialogflow: RequestTaxi Intent
Dialogflow ->> Fulfillment: Webhook
Fulfillment -->> Fulfillment: Google Map integration
Fulfillment -->> Dialogflow: Respond to User
Dialogflow -->> Google Assistant: Respond to User
Google Assistant -->> User: Respond to User
User ->> Google Assistant: Confirmation
```

####    Create Intents

-   建立如下的Intent

<img src='./img/df-taxi-intents-all.png' style='width:200:height:300'/>

-   訓練相關Intent

在這個範例中我會使用以下的系統Entity．這裡就不再敘述如何訓練

    -   @sys.date
    -   @sys.time
    -   @sys.location

-   在以下Intent啟用Fulfillment

    -   Default Welcome Intent
    -   Default Welcome Intent - yes
    -   RequestTaxi
    -   Request_Confirmation_Yes

<img src='./img/df-taxi-fulfillment.png' style="width:30%;height:30%"/>

-   對以下Intent設定Event為Google Assistant Permission

    在Welcome Intent時我們會要求使用者給予權限，當使用者願意賦予權限時，系統便會根據這個設定調用這個Intent

    -   Default Welcome Intent - yes

<img src='./img/df-taxi-event-permission.png' style="width:30%;height:30%"/>


-   對以下Intent設定Event為Google Assistant Options

    當我們詢問使用者是否確定要叫車時，會請使用者輸入是或否，此時便會調用這個Intent

    -   Request_Confirmation_Yes

-   設定Fulfillment

<img src='./img/df-taxi-fulfillment-url.png' style="width:30%;height:30%"/>


####    設定Actions on Google資訊

-   設定呼叫的Intent並到Actions on Google設定頁面

<img src='./img/df-taxi-manage-ga-integration.png' style="width:40%;height:40%"/>

-   在Develop, Invocation頁籤指定我們的Action名稱

<img src='./img/df-taxi-develop-invocation.png' style="width:30%;height:30%"/>

-   為了正常在手機Google Assistant運作，需要指定相關的Capability

<img src='./img/df-taxi-capabilities.png.png' style="width:30%;height:30%"/>


