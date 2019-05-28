const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(__dirname + '/database.json');
const db = low(adapter);

// Set database defaults
db.defaults({
        settings: [{
            name: 'FFMPEG',
            data: {
                size: '700x540',
                encoder: 'omx',
                decoder: 'omx',
                fileExtension: '.mp4',
            },
        }],
    })
    .write();

module.exports = db;
