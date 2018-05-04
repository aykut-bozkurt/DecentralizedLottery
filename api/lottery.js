var express = require('express');
var app = express();
//var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
app.use(express.static('./frontend'));


/*app.post('/buyfullticket', function (req, res) {
    var fvalue = callbuyfullticket(req.body.accaddr, req.body.hash) ;
    res.send(JSON.stringify("You bought a full ticket"));
});

app.post('/buyhalfticket', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var fvalue = callbuyhalfticket(req.params["accaddr"], req.params["hash"]) ;

    res.send(JSON.stringify("You bought a half ticket"));
});

app.post('/buyquarterticket', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var fvalue = callbuyquarterticket(req.params["accaddr"], req.params["hash"]) ;

    res.send(JSON.stringify("You bought a quarter ticket"));
});

app.post('/revealticket', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var fvalue = callrevealticket(req.params["accaddr"], req.params["no1"], req.params["no2"], req.params["no3"]) ;

    res.send(JSON.stringify("You revealed a ticket"));
});

app.get('/getprice', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var fvalue = callgetprice(req.params["accaddr"]) ;

    res.send(JSON.stringify("You tried to get your price"));
});*/


var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});