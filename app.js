var agent = require('./index').agent;
var express = require('express')
var bodyParser = require('body-parser')
const expressApp = express().use(bodyParser.json());
expressApp.post('/fulfillment', agent);
expressApp.get('/test', (req,res) => {
        try{
            console.log(`[INFO]===> TEST <===`);
            console.log(`[INFO]${JSON.stringify(req.body)}`);
        }catch(ex){
            console.log(`[ERROR]${ex}`);
        }
        res.send("ok");
    }
);
expressApp.listen(80);    //  Cloud Run now only supports port 8080
console.log(`express server listening on port 80...`);