// require libraries
const Transcorder = require('./Transcorder/Transcorder');

// require database
const db = require('./databases/db');

// declare transcorder
const transcorder = new Transcorder(db);