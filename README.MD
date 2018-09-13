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

### Debugging
```npm run server-dev``` Starts NodeJS with nodeamon and with "--inspect" flag. "--inspect" flag opens websockets on port 9229 with inspect capabilities and source-maps already in place.

##### Google Chrom
To start debugging with Chrome (better for memory leak debugs - in my opinion), Open Chrome to "chrome://inspect/#devices" after you run ```npm run server-dev``` and select inspect on the approperiate NodeJS process, there you'll find chrome debugging tools attached to the NodeJS process.

##### Visual Studio Code
If you cloned this repository there will be a .vscode folder with a launch.json in place. Just run the "Attach to remote" with F5 or from the debugging panel after you run ```npm run server-dev``` this will attach a remote debugger to the node process.

Happy debugging!
