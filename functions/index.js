const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const main = express();
const firebase = require('firebase');
const moment = require('moment-timezone');


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





/*                                       
      db      `7MM"""Mq.`7MMF'
     ;MM:       MM   `MM. MM  
    ,V^MM.      MM   ,M9  MM  
   ,M  `MM      MMmmdM9   MM  
   AbmmmqMA     MM        MM  
  A'     VML    MM        MM  
.AMA.   .AMMA..JMML.    .JMML.
*/
 
// Count all people in the room
app.get('/:roomID/current', (req, res) => {

    let halfAnHourAgo = moment().subtract(30, 'minutes').toDate().getTime();
    let active = new Set();

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


/*                                                             
                                                                                 
  .g8"""bgd `7MM"""Mq.   .g8""8q. `7MN.   `7MF'       `7MMF' .g8""8q. `7MM"""Yp, 
.dP'     `M   MM   `MM..dP'    `YM. MMN.    M           MM .dP'    `YM. MM    Yb 
dM'       `   MM   ,M9 dM'      `MM M YMb   M           MM dM'      `MM MM    dP 
MM            MMmmdM9  MM        MM M  `MN. M           MM MM        MM MM"""bg. 
MM.           MM  YM.  MM.      ,MP M   `MM.M           MM MM.      ,MP MM    `Y 
`Mb.     ,'   MM   `Mb.`Mb.    ,dP' M     YMM      (O)  MM `Mb.    ,dP' MM    ,9 
  `"bmmmd'  .JMML. .JMM. `"bmmd"' .JML.    YM       Ymmm9    `"bmmd"' .JMMmmmd9  
                                                                   
*/

//hours ** run only every hour **
app.get('/cron/:roomID/hour', (req, res) => {
  let oneHourAgo = moment().subtract(1, 'hour').toDate().getTime();
  let active = new Set();
  return firebase.database().ref('/'+ req.params.roomID)
      .orderByChild("timestamp")
      .startAt(oneHourAgo)
      .endAt( Date.now())
      .once('value').then(function(snapshot) {
       snapshot.forEach(function(data){
          let mac = data.val().mac;
          active.add(mac)
      });
      //save report 
      var ts = moment.tz(moment(),"Asia/Bangkok").format("H");
 
      firebase.database().ref('/hour_reports/' + req.params.roomID+"/"+moment.tz(moment(),"Asia/Bangkok").format("YYYY_MM_DD")+'/'+ts).set({
        people: active.size
      }); 
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ people: active.size }));
   
    });
})








exports.api = functions.https.onRequest(main);