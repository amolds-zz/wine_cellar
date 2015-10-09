
var express = require('express');
var wine = require('./routes/wines');

var app = express();


app.configure(function () {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiney', 'dev' */
    app.use(express.bodyParser());
});


app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);


//app.get('/wines', function(req, res) {
//    res.send([{name:'wine1'}, {name:'wine2'}]);
//
//});

//app.get('/wines/:id', function(req, res) {
//    res.send({id:req.params.id, name: "The Name", description: "description"});
//
//});

app.listen(3000);

console.log('Listening on port 3000...');


/*
var http = require('http');

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!\n');
});

server.listen(3000);
console.log('Server running on port 3000');
*/
