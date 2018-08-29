// import packages
import express from 'express';
import bodyParser from 'body-parser';

// import libraries
import Transcorder from '../Transcorder/Transcorder';

// import database
import db from '../config/db';

// import routes
import ssr from './ssr';
import systemInfo from './api/systemInfo';
import ffmpegSettings from './api/ffmpeg-settings';

// create express app
const app = express();

// dedlare transcorder
const transcorder = new Transcorder();
// pass transcorder through app
app.set('transcorder', transcorder);

// padd db to app
app.set('db', db);

// set view engine
app.set('view engine', 'ejs');

// configure app
app.use(express.static('public'));
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes and views
app.use('/api/system-info', systemInfo);
app.use('/api/ffmpeg-settings', ffmpegSettings);

// all other routes
app.use('/*', ssr);

// start server
app.listen(3000, () => {
  console.log('Hello World listening on port 3000!');
});
