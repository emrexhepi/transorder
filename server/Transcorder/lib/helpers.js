import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';

const execCmd = util.promisify(exec);

// return underline followed with a random string
export const makeRandomID = () => `_${Math.random().toString(36).substr(2, 12)}`;

// creates the dir to the given path
export const mkDirByPathSync = (targetDir, { isRelativeToScript = false } = {}) => {
    const { sep } = path;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
        } catch (err) {
            if (err.code === 'EEXIST') { // curDir already exists!
                return curDir;
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if ((!caughtErr || caughtErr) && targetDir === curDir) {
                throw err; // Throw if it's just the last created dir.
            }
        }

        return curDir;
    }, initDir);
};

// file media info
export async function getMediaInfo(location) {
    let execRes = null;
    let fileExists = false;
    let fileFormat = {};
    let corrupted = false;
    let response = {};
    let duration = 0;
    const command = `ffprobe -v quiet -print_format json -show_format ${location}`;
    // location = "C:\\Users\\IG\\Desktop\\RecordsIPTV\\N24\\2019-01-18\\N24_20190118_12-41-50.mp4";
    
    // check if file exists
    try {
        const fileStats = fs.lstatSync(location);
        fileExists = fileStats.isFile();
    } catch (e) {
        fileExists = false;
    }

    // get info as json
    try {
        execRes = await execCmd(
            command,
        );
        execRes = JSON.parse(execRes.stdout);

        if (execRes.format) {
            fileFormat = execRes.format;
            // eslint-disable-next-line prefer-destructuring
            duration = fileFormat.duration;
        }
    } catch (e) {
        execRes = JSON.parse(e.stdout);
    }

    // check if corrupted
    if (fileExists && Object.keys(execRes).length === 0) {
        corrupted = true;
    }
    
    // compile respose
    response = {
        fileExists,
        corrupted,
        duration,
        fileFormat,
    };

    return response;
}

// save object to json
export function saveJsonObjToFile(obj, filePath) {
    fs.writeFile(filePath, JSON.stringify(obj), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

// default export
export default mkDirByPathSync;
