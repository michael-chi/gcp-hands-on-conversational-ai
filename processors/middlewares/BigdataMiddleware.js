const EventPublisher = require('../EventPublisher.js');
const GoogleMap = require('../GoogleMap.js');
const config = {
    projectId: process.env.PROJECT_ID,
    location: process.env.LOCATION,
    key: process.env.MAP_KEY,
    topic: process.env.BIGDATA_TOPICNAME
};

async function processRequest(conv, config) {
    console.log('Middleware Processing request...');
    //  conversationId
    const conversationId = conv.request.conversation.conversationId;
    console.log(`Conversation Id:${conversationId}`);
    /*
    {
        "location":{
            "coordinates":{
                "latitude":125.0593835,
                "longitude":221.45938530000001
            },
            "formattedAddress":"XX路1111號 XX企業行, XX區, XX市 123",
            "zipCode":"123",
            "city":"XX區"
            }
        }
    }
    */
    const from = conv.device;
    console.log(`[INFO]from=${JSON.stringify(from)}`);
    /*
    {
        "location":{
            "country":"",
            "city":"XX市",
            "admin-area":"",
            "business-name":"",
            "street-address":"ＸＸ路OOO巷",
            "zip-code":"",
            "shortcut":"",
            "island":"",
            "subadmin-area":"XX區"
        },
        "location.original":"XX市XX區XX路OOO巷",
        "time":"",
        "time.original":"",
        "date":"",
        "date.original":""
        }
    }
    */
    try {
        const to = conv.contexts.input['requesttaxi-followup'].parameters;
        const map = new GoogleMap(config);
        const coordinates = await map.getGeoCoordinates(to);
        console.log(`You want to got to [${(coordinates.lat)},${coordinates.lng}] at ${coordinates}`);
        const message = {
            conversationId: conversationId,
            time: new Date(new Date().toUTCString()),
            from: {
                latitude: from.location.coordinates.latitude,
                longitude: from.location.coordinates.longitude,
                address: from.location.formattedAddress
            },
            to: {
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                address: to['location.original']
            }
        };

        //  Publish event to Pub/Sub
        const publisher = new EventPublisher(config);
        console.log(`[INFO]Config:${JSON.stringify(config)}`);
        console.log(`[INFO]topic = ${config.topic}`);
        await publisher.publish(config.topic, JSON.stringify(message));
    } catch (ex) {
        console.error(`[ERROR]Failed to process middleware request`);
        console.error(`[ERROR]${ex}`);
    }
}
//module.exports.BigdataMiddleware = BigdataMiddleware;
module.exports.setup = function (app) {
    app.middleware((conv) => {
        if (conv.action == 'RequestTaxi.RequestTaxi-yes') {
            processRequest(conv, config);
        }
    });
}