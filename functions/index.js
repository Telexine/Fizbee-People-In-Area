const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const main = express();
const firebase = require('firebase');

const config = {
    apiKey: "AIzaSyBq381RKQM6Gs_nvLjTGUPxqVC3m76wecg",
    authDomain: "fizbee-4c002.firebaseapp.com",
    databaseURL: "https://fizbee-4c002.firebaseio.com",
    projectId: "fizbee-4c002",
    storageBucket: "fizbee-4c002.appspot.com",
  };
firebase.initializeApp(config);
let database = firebase.database();
// Automatically allow cross-origin requests
main.use(cors({ origin: true }));
 
main.use('/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));



// View all contacts
app.get('/:roomID/', (req, res) => {
    res.status(200).send("ok")
})



exports.api = functions.https.onRequest(main);