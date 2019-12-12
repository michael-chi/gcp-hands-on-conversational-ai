//"2019-12-11 10:00:21 UTC"
const config = {
    projectId: 'kalschi-demo-001',
    location: 'global',
    key: 'AIzaSyAbToxzDS7gN8t5Yp9zbBA909WampEXTqI',
    topic: 'kalschi-bot-event-publisher'
};

const GoogleMap = require('../processors/GoogleMap.js');
var map = new GoogleMap(config);
map.getDistance({lng:121.56495869999999, lat:25.0336763},
                                    {lng:-110.9746081, lat:32.2245293}).then(console.log);
//console.log(result);