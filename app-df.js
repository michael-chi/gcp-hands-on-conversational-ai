
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

var express = require('express')
var bodyParser = require('body-parser')
const expressApp = express().use(bodyParser.json());
expressApp.post('/fulfillment', (req,res) => {
    console.log(JSON.stringify(req));
    res.send("ok");
});
expressApp.post('/test', (req,res) => {
    const agent = new WebhookClient({ req, res });
});
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