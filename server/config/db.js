import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('./databases/db.json');
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

export default db;
