const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const main = express();
const firebase = require('firebase');
const moment = require('moment');


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

 
// Count all people in the room
app.get('/:roomID/current', (req, res) => {

    let halfAnHourAgo = moment().subtract(30, 'minutes').toDate().getTime();
    let active = new Set();

    console.log(halfAnHourAgo + "     "+  Date.now())
    return firebase.database().ref('/'+ req.params.roomID)
        .orderByChild("timestamp")
        .startAt(halfAnHourAgo)
        .endAt( Date.now())
        .once('value').then(function(snapshot) {
         snapshot.forEach(function(data){
            let mac = data.val().mac;
            active.add(mac)
        });
  
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ people: active.size }));
     
      });





  
})



exports.api = functions.https.onRequest(main);