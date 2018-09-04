// import childProcess from 'child_process';
// import util from 'util';

// import process libraries
import kill from 'tree-kill';

import { execFile } from 'child_process';

import { DateTime } from 'luxon';
import * as timeHelpers from './timeHelpers';

class FFMPEG {
    processes = [];

    constructor(stream, settings) {
        this.stream = stream;
        this.settings = settings;
        this.processes = [];

        // handle exit signals
        process.on('SIGTERM', (signal) => {
            this.stopRecord(signal);
            process.exit();
        });
        process.on('SIGINT', (signal) => {
            this.stopRecord(signal);
            process.exit();
        });
        process.on('SIGHUP', (signal) => {
            this.stopRecord(signal);
            process.exit();
        });
        process.on('SIGBREAK', (signal) => {
            this.stopRecord(signal);
            process.exit();
        });
    }

    updateSettings(settings) {
        this.settings = settings;
    }

    // Start ffmpeg recording
    record(_recProps) {
        console.log('\x1b[32m%s\x1b[0m', `[FMPEGMan.js] - record() ${this.stream.name} at ${DateTime.local().toISOTime()}`);
        
        const recProps = _recProps;
        
        // set duration to no decimal
        recProps.duration = recProps.duration.toFixed(0);

        console.log('with props: ', recProps);

        // test timestamp
        const ts = Math.round((new Date()).getTime() / 1000);

        // initiate ffmpeg process
        const ffmpegProcess = 
            execFile(
                'ffmpeg',
                [
                    '-i', this.stream.path,
                    '-ss', recProps.skipSecs, // skip first seconds
                    '-t', recProps.duration,
                    '-r', 25,
                    '-b:v', '300k',
                    '-s', '720x576',
                    '-y', `${this.stream.recordBasePath}${this.stream.name}_${ts}.mp4`,
                ],
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('stderr', stderr);
                
                        // throw error;
                    }
                
                    console.log('stdout', stdout);
                },
            );
        
        // console.log output data
        ffmpegProcess.stdout.on(
            'data',
            (data) => {
                console.log(`FFMPEG stdout: ${data.toString()}`);
            },
        );

        // console.log input data
        ffmpegProcess.stdin.on(
            'data',
            (data) => {
                console.log(`FFMPEG stdin: ${data.toString()}`);
            },
        );
        
        // console.log error data
        ffmpegProcess.stderr.on(
            'data',
            (data) => {
            console.log(`FFMPEG stderr: ${data}`);
            },
        );

        this.processes.push(ffmpegProcess);


        // set timeout to finish record job
        // setTimeout(
        //     this.finish,
        //     timeHelpers.secondsToMilliseconds(recProps.duration),
        // );
    }

    finish() {
        // log finish time
        console.log('\x1b[36m%s\x1b[0m', `[FMPEGMan.js].finish() - Record finished at ${DateTime.local().toISOTime()}`);
    }
    
    // stop ffmpeg recording instances
    stopRecord(signal = 'SIGINT') {
        this.processes.forEach((ffmpegProcess) => {
            kill(ffmpegProcess.pid, signal);
        });
        console.log('[FFMPEGMan.js].stopRecord() - stoping all record instances!');
    }
}

export default FFMPEG;
