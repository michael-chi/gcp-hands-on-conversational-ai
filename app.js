var dialogflowFirebaseFulfillment = require('./index.js').dialogflowFirebaseFulfillment;
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(function (req, res) {
    dialogflowFirebaseFulfillment(req,res);
})
app.listen(3000);
console.log('listening on http://localhost:3000');