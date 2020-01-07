const uuidv1 = require('uuid/v1');
const records = [
{
    conversationId: uuidv1(),
    time: new Date(2019,3,3,11,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    from_address: '台北市大直',
    from_longitude: 121.5475003,
    from_latitude: 25.0834607,
    to_address: '桃園機場第二航站',
    to_longitude: 121.2323393,
    to_latitude: 25.0789052,
    distance_km: 44.5
},
{
    conversationId: uuidv1(),
    time: new Date(2019,3,10,11,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    from_address: '台北市大直',
    from_longitude: 121.5475003,
    from_latitude: 25.0834607,
    to_address: '桃園機場第二航站',
    to_longitude: 121.2323393,
    to_latitude: 25.0789052,
    distance_km: 44.5
},
{
    conversationId: uuidv1(),
    time: new Date(2019,3,17,11,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    from_address: '台北市大直',
    from_longitude: 121.5475003,
    from_latitude: 25.0834607,
    to_address: '桃園機場第二航站',
    to_longitude: 121.2323393,
    to_latitude: 25.0789052,
    distance_km: 44.5
},
{
    conversationId: uuidv1(),
    time: new Date(2019,3,24,11,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    from_address: '台北市大直',
    from_longitude: 121.5475003,
    from_latitude: 25.0834607,
    to_address: '桃園機場第二航站',
    to_longitude: 121.2323393,
    to_latitude: 25.0789052,
    distance_km: 44.5
},
{
    conversationId: uuidv1(),
    time: new Date(2019,4,1,11,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    from_address: '台北市大直',
    from_longitude: 121.5475003,
    from_latitude: 25.0834607,
    to_address: '桃園機場第二航站',
    to_longitude: 121.2323393,
    to_latitude: 25.0789052,
    distance_km: 44.5
},



{
    conversationId: uuidv1(),
    time: new Date(2019,3,10,10,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    to_address: '台北市大直',
    to_longitude: 121.5475003,
    to_latitude: 25.0834607,
    from_address: '桃園機場第二航站',
    from_longitude: 121.2323393,
    from_latitude: 25.0789052,
    distance_km: 44.5
},
{
    conversationId: uuidv1(),
    time: new Date(2019,3,15,15,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    to_address: '台北市大直',
    to_longitude: 121.5475003,
    to_latitude: 25.0834607,
    from_address: '桃園機場第二航站',
    from_longitude: 121.2323393,
    from_latitude: 25.0789052,
    distance_km: 44.5
},
{
    conversationId: uuidv1(),
    time: new Date(2019,3,20,20,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    to_address: '台北市大直',
    to_longitude: 121.5475003,
    to_latitude: 25.0834607,
    from_address: '桃園機場第二航站',
    from_longitude: 121.2323393,
    from_latitude: 25.0789052,
    distance_km: 44.5
},
{
    conversationId: uuidv1(),
    time: new Date(2019,4,5,5,00,00),
    customer_hash: 9000001,
    plate_no: 'ABC-8888',
    to_address: '台北市大直',
    to_longitude: 121.5475003,
    to_latitude: 25.0834607,
    from_address: '桃園機場第二航站',
    from_longitude: 121.2323393,
    from_latitude: 25.0789052,
    distance_km: 44.5
},
];
const fn = './load-generator/data/vip.json';
require('fs').writeFileSync(fn,'');

records.forEach(element => {
    require('fs').appendFileSync(fn,`${JSON.stringify(element)}\r\n`);
});