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
    try{
        console.log(`conv.request=${JSON.stringify(conv.request)}`);
        console.log(`conv.request=${JSON.stringify(conv.request)}`);
    }catch{

    }
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
        const to = conv.contexts.input['requesttaxi-followup'].parameters.destination;

        console.log(`[INFO][BigdataMiddleware]]Parameter in RequestTaxi-followup: ${JSON.stringify(to)}`);
        console.log(`[INFO][BigdataMiddleware]]Parameter in RequestTaxi-followup: ${JSON.stringify(conv.contexts.input['requesttaxi-followup'])}`);
        
        const map = new GoogleMap(config);
        const distance = await map.getDistance(from.location.coordinates, to);
        console.log(`You want to got to [${(to.lat)},${to.lng}] at ${to}`);
        var user = '';
        try{
            user = conv.request.user.profile.displayName;
        }catch{

        }
        const message = {
            conversationId: conversationId,
            time: new Date(new Date().toISOString()),
            from_latitude: from.location.coordinates.latitude,
            from_longitude: from.location.coordinates.longitude,
            from_address: from.location.formattedAddress,
            to_latitude: to.lat,
            to_longitude: to.lng,
            to_address: conv.contexts.input['requesttaxi-followup'].parameters['location.original'],
            distance_km: distance,         //TODO:should be calculated
            plate_no: "1688-TW",    //TODO:should retrieve from bigquery ?
            customer_hash:user        //TODO:hash for customer identification
        };

        //  Publish event to Pub/Sub
        const publisher = new EventPublisher(config);
        console.log(`[INFO]Message:${JSON.stringify(message)}`);
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