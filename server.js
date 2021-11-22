// server.js

// set up ======================================================================
// get all the tools we need
var aws = require("aws-sdk");
var express = require("express");
var app = express();
var port = process.env.PORT || 9000;
const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var configAWS = require("./config/aws.js");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var multer = require("multer");
var fs = require("fs");
var configDB = require("./config/database.js");
var multerS3 = require("multer-s3");
var s3 = new aws.S3(configAWS);

var db;

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err);
  db = database;
  require("./app/routes.js")(app, passport, db, fs, s3, multer, multerS3, aws);
}); // connect to our database

require("./config/passport")(passport); // pass passport for configuration

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "rcbootcamp2021b", // session secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// launch ======================================================================
app.listen(port);
console.log("The magic happens on port " + port);
