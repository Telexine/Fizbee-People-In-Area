![img](https://github.com/Telexine/Fizbee-WEB-People-In-Area/blob/master/Fizbee-poster.jpg?raw=true)


Fizbee - People In Area
================

Lightweight Responsive PWA Offline capability  WebApp for Monitor Crowd in the area with historical data
by utilizing Bluetooth monitor

Architecture 
------------

### Backend
- Firebase Realtime Database
- Firebase Cloud Function
- Firebase Hosting

### Frontend
- Google Workbox For Cache and Offline
- Manifest for PWA
- Argon For UI
- MomentJS For timestamp and Timezone
- Chart.JS


Requirements
------------
- NodeJS
- firebase for deployment

Installation
------------

in root
```sh
$ firebase init 
```
<login and setup, public folder as root hosting>

in /functions
```sh
$ npm i
$ firebase deploy --only functions
```
in /public
```sh
$ workbox injectManifest workbox-config.js // generate sw.js
```

Run
------------

```sh
$ firebase serve --port=5005
or
$ firebase deploy
```
 
