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

var whitelist = ['https://fizbee-4c002.firebaseapp.com/', 'http://localhost']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


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

    let interval = moment().subtract(10, 'minutes').toDate().getTime();
    let active = new Set();

    return firebase.database().ref('/'+ req.params.roomID)
        .orderByChild("timestamp")
        .startAt(interval)
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



// REPORT 

// past 24 hours
app.get('/reports/hour_reports/:roomID/:date', (req, res) => {
  let list = []
  return firebase.database().ref(`/hour_reports/${req.params.roomID}/${req.params.date}`)
      .once('value').then(function(snapshot) {
       snapshot.forEach(function(data){
          let p = data.val().people;
          list.push([data.key,p])
      });
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify( list ));
    });
})


// Weekly
app.get('/reports/week_reports/:roomID', (req, res) => {
  let DayOfThisWeek = moment.tz(moment(),"Asia/Bangkok").startOf('Week').toDate().getTime();
  let EndDayOfThisWeek = moment.tz(moment(),"Asia/Bangkok").endOf('Week').toDate().getTime();
  let list = []
  return firebase.database().ref('/day_reports/'+ req.params.roomID)
      .orderByChild("Date")
      .startAt(DayOfThisWeek)
      .endAt( Date.now())
      .once('value').then(function(snapshot) {
       snapshot.forEach(function(data){
            let date =data.key;
            list.push([moment(date, "YYYY_MM_DD").weekday(),data.val().people ])
      });

      console.log(list)
      //save report 
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(list ));
   
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

//Daily ** run only every Day **
app.get('/cron/:roomID/day', (req, res) => {
  let oneDayAgo = moment().subtract(1, 'day').toDate().getTime();
  let active = new Set();
  return firebase.database().ref('/'+ req.params.roomID)
      .orderByChild("timestamp")
      .startAt(oneDayAgo)
      .endAt(Date.now())
      .once('value').then(function(snapshot) {
       snapshot.forEach(function(data){
          let mac = data.val().mac;
          active.add(mac)
      });
      //save report 
      var ts = moment.tz(moment(),"Asia/Bangkok").format("H");
 
      firebase.database().ref('/day_reports/' + req.params.roomID+"/"+moment.tz(moment(),"Asia/Bangkok").format("YYYY_MM_DD")+'/').set({
        people: active.size,
        Date: firebase.database.ServerValue.TIMESTAMP
      }); 
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ people: active.size }));
   
    });
})

  
exports.api = functions.https.onRequest(main);