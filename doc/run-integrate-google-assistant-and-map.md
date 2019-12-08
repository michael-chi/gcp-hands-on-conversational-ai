##  Overview

修改先前的Fulfillment以符合新的需求

####    Integrate with Actions on Google

-   為了程式簡潔，我把Intent Handler都分開，同時在index.js中透過迴圈呼叫設定所有的Intent

```javascript
//  Add Intent handlers below
handlers.push(require('./processors/intents/RequestTaxi.js'));
handlers.push(require('./processors/intents/DefaultWelcome.js'));

handlers.forEach(element => {
    element.setup(app);
});
```

####    Intent Handler

新增叫車的Intent Handler為例

-   檢查裝置是否有螢幕

```javascript
if (!conv.screen) {
    conv.ask('抱歉，你必須在手機上使用這個服務');
    return;
}
```

-   透過Google Geocoding API將地名轉換為座標

    其中[GoogleMap](../processors/GoogleMap.js)是與Google Map API整合的Helper calss

```javascript
const config = {
    //  ...omitted...
    location: `${params.location['city']} ${params.location['subadmin-area']} ${params.location['street-address']} ${params.location['business-name']}`,
};
//  ...omitted...
const map = new GoogleMap(config);
const coordinates = await map.getGeoCoordinates(config.location);
```

-   Google Assistant不支援在畫面上直接使用動態地圖，為了讓使用者可以透過地圖看到實際目的地位置，我們需要先將地理座標傳給Google Static API以產生靜態地圖影像，再將這個影像放到Rich Message回傳給使用者

```javascript
var url = await map.getStaticMap(config.location, coordinates);
```

-   最後產生回應給使用者確認目的地位置

    這裡要特別注意的是，回傳Rich Message前必須要先有一個Simple Message，因此我會先回應一段簡單的句子再回傳BasicCard

    詳情可以參考[這裡](https://developers.google.com/assistant/conversational/responses#visual_selection_responses)的說明

```javascript
var card = new BasicCard({
    text: '以下是您的目的地位置資訊',
    title: '目的地',
    image: new Image({
        url: url,
        alt: '目的地'
    }),
    display: 'CROPPED',
});
console.log(`[Info]Card=${JSON.stringify(card)}`);

conv.ask(`以下是您的目的地資訊，確定要叫車嗎？`);
conv.ask(card);
conv.ask(new Suggestions(['是', '否']));
```