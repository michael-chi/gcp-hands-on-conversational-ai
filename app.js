var agent = require('./index').agent;
var express = require('express')
var bodyParser = require('body-parser')
const expressApp = express().use(bodyParser.json());
expressApp.post('/fulfillment', agent);
expressApp.get('/test', (req,res) => {
        res.send(req.body);
    }
);
expressApp.listen(8080);