
var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = require('bson').BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});

db = new Db('winedb', server);

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'winedb' database");
        db.collection('wines', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist.  Creating it with sample data...");
                populateDB();
            }
        });
    }
});


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('wines', function(err, collection) {
        if (err) {
            console.log(err);
        } else {
            var oId = new BSON.ObjectID(id);
            collection.findOne({'_id':oId}, function(err, item) {
                res.send(item);
            });
        }
    });
};


exports.findAll = function(req, res) {
    db.collection('wines', function(err, collection) {
        collection.find().toArray(function(err, items) {
           res.send(items);
        });
    });
};


exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
       collection.insert(wine, {safe:true}, function(err, result) {
          if (err) {
              res.send({'error': 'An error has occurred'});
          } else {
              console.log('Success: ' + JSON.stringify(result[0]));
              res.send(result[0]);
          }
       });
    });
};


exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
       collection.update({'_id':new BSON.ObjectID(id) }, wine, {safe:true}, function(err, result) {
           if (err) {
               console.log('Error updating wine: ' + err);
               res.send({'error': 'An error has occurred'});
           } else {
               console.log('' + result + ' document(s) updated');
               res.send(wine);
           }
       })
    });
};


exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
       collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
           if (err) {
               console.log('Error deleting wine: ' + err)
               res.send({'error': 'An error has occurred'})
           } else {
               console.log('' + result + ' document(s) deleted');
               res.send(req.body);
           }
       });
    });
};



var populateDB = function() {
    var wines = [
        {
            name: "CHATEAU DE SAINT COSME",
            year: "2009",
            grapes: "Grenache / Syrah",
            country: "France",
            region: "Southern Rhone",
            description: "The aromas of fruit and spice...",
            picture: "saint_cosme.jpg"
        },
        {
            name: "LAN RIOJA CRIANZA",
            year: "2006",
            grapes: "Tempranillo",
            country: "Spain",
            region: "Rioja",
            description: "A resurgence of interest in boutique vineyards...",
            picture: "lan_rioja.jpg"
        }
    ];

    db.collection('wines', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result){});
    });
};

