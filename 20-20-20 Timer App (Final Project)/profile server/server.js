// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/eye_profiles");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Model
let ProfileInfo = mongoose.model('profile_info', {
    od: String,
    os: String,
    gp: String,
    opto: String,
    conditions: String
});


// Get profile details
app.get('/api/profile', function (req, res) {

    console.log("Listing profile details...");

    //use mongoose to get profile in the database
    ProfileInfo.find(function (err, profile) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(profile); // return profile in JSON format
    });
});

// Create a new profile
app.post('/api/profile', function (req, res) {

    console.log("Creating profile...");

    ProfileInfo.create({
        od: req.body.od,
        os: req.body.os,
        gp: req.body.gp,
        opto: req.body.opto,
        conditions: req.body.conditions,
        done: false
    }, function (err, profile) {
        if (err) {
            res.send(err);
        }

        // create and return profile
        ProfileInfo.find(function (err, profile) {
            if (err)
                res.send(err);
            res.json(profile);
        });
    });

});

// Update profile
app.put('/api/profile/:id', function (req, res) {
    const profile_info = {
        od: req.body.od,
        os: req.body.os,
        gp: req.body.gp,
        opto: req.body.opto,
        conditions: req.body.conditions
    };
    console.log("Updating profile - ", req.params.id);
    ProfileInfo.update({_id: req.params.id}, profile_info, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// Delete profile
app.delete('/api/profile/:id', function (req, res) {
    ProfileInfo.remove({
        _id: req.params.id
    }, function (err, profile) {
        if (err) {
            console.error("Error deleting profile", err);
        }
        else {
            ProfileInfo.find(function (err, profile) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(profile);
                }
            });
        }
    });
});


// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080);
console.log("Eye profile server listening on port  - ", (process.env.PORT || 8080));