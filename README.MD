# Transcorder
RaspberryPi based hardware accelerated FFMPEG transcoder and recorder

[ExpressJS, ReactJS Boilerplate]: <https://github.com/tahnik/react-expressjs>

### NPM Commands
 - ```npm run dev // Initiates webpack development server for frontend hotreload (ReactJS...)```
 - ```npm run build // build the application for frontend and backend```
 - ```npm run build:server // builds server application```
 - ```npm run build:client // builds client side application```
 - ```npm start // starts the node server in localhost:3000```
 - ```npm run server-dev // Initiates nodeamon for server-side hotreload development server```
 - ```npm run lint // lints the whole js application```

 ### Projcet Memo
 ##### Schedulre Settings
 ````
    {
      "name": "scheduler",
      "data": {
        // cannot be greater then stream duration secs
        "preDurationSecs": 10,
        // cannot be greater then preDurationSecs secs
        "skipSecs": 5,
        "afterDurationSecs": 5
      }
    }
````

##### Streams
 ````
    "streams": [
      {
        "name": "RTK",
        "path": "http://rtk.com",
        "record": true,
        // should always be greater then 5
        "recDuration" : 20
      }
    ]
````