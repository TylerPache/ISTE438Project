const express = require("express");
let app = express();

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

const bodyParser = require("body-parser");
let Grid = require("gridfs-stream");
const {mongo} = require("mongoose");
Grid.mongo = mongo;


// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

recordRoutes.route("/getAll").get(function (req, res) {
  let db_connect = dbo.getDb("NYParkData");
  db_connect.listCollections()
      .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("NYParkData");
  db_connect
    .collection("ParkData")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


// This section will help you get records by Facility name
recordRoutes.route("/record/Facility/:Facility").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = {Facility : new RegExp(req.params.Facility, 'i')}
  db_connect
      .collection("ParkData")
      .find(myquery)
      .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
      });
});

// This section will help you get records by County name
recordRoutes.route("/record/County/:County").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {County : new RegExp(req.params.County, 'i')}

    db_connect
        .collection("ParkData")
        .find(myquery)
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get records by Region name
recordRoutes.route("/record/Region/:Region").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {'OPRHP Region' : new RegExp(req.params.Region, 'i')}

    db_connect
        .collection("ParkData")
        .find(myquery)
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you get records within a certain distance of geo location
recordRoutes.route("/record/Location/:lat&:long&:distance").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { loc:{ $near:{$geometry: {type: "Point" ,coordinates: [ parseFloat(req.params.lat), parseFloat(req.params.long) ]},$maxDistance: parseInt(req.params.distance)}}}
    console.log(parseInt(req.params.lat), parseInt(req.params.long));
    db_connect
        .collection("ParkData")
        .find(myquery)
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you update a record by id.
recordRoutes.route("/comment/:Facility").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { Facility: req.params.Facility };
  console.log(req.body.name, req.body.comment);
  let newvalues = {
    $push: {
        comments : {
            name: req.body.name,
            comment: req.body.comment
        }
    },
  };
  db_connect
    .collection("ParkData")
    .updateMany(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});


// This section will return images if one exists
recordRoutes.route("/record/image/:Facility").get(function (req, res) {
    let db_connect = dbo.getDb();
    let gfs = Grid(db_connect);
    let fileName = req.params.Facility.replace(/\s/g, "");
    let readstream = gfs.createReadStream({filename: fileName});
    readstream.on("error", function(err){
        res.send("No image found with that title");
    });
    readstream.pipe(res);
});


module.exports = recordRoutes;
