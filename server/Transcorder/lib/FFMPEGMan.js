// import process libraries
import kill from 'tree-kill';

import { execFile } from 'child_process';

import { DateTime } from 'luxon';

import * as helper from './ffmpegHelpers';

class FFMPEG {
    processes = [];
    pipeline = [];

    constructor(stream, settings) {
        this.stream = stream;
        this.settings = settings;

        process.on('exit', () => {
            this.killProcesses();
        });
    }

    updateSettings(settings) {
        this.settings = settings;
    }

    createFolderAndFileName(recProps) {
        // get ouput path
        let { outputDirectory } = this.stream;
        const dateStr = recProps.startTime.toISODate();
        const timeStr = DateTime.local().toFormat('HH-mm-ss');
        // check if outputDirectory has backslash
        if (outputDirectory[outputDirectory.length - 1] !== '\\') {
            outputDirectory += '\\';
        }

        // add stream name to directory
        outputDirectory += `${this.stream.name}\\${dateStr}\\`;

        // check and create folder
        helper.mkDirByPathSync(outputDirectory);

        // create filename
        const filename = `${dateStr}_${timeStr}.mp4`;

        return outputDirectory + filename;
    }

    createPipeline(recProps) {
        const { global, inputPipe, outputPipe } = this.settings;

        const outputPath = this.createFolderAndFileName(recProps);
    
        const pipeline = [];
        
        // add global properties to pipeline
        Object.keys(global).forEach((key) => {
            pipeline.push(key, global[key]);
        });
        
        // add inputPipe properties to pipeline
        Object.keys(inputPipe).forEach((key) => {
            switch (key) {
                case '-ss':
                    pipeline.push(key, recProps.skipSecs);
                    break;
                case '-i':
                    pipeline.push(key, this.stream.input);
                    break;
                default:
                    pipeline.push(key, inputPipe[key]);
                    break;
            }
        });
        
        // add outputPipe properties to pipeline
        Object.keys(outputPipe).forEach((key) => {
            switch (key) {
                case '-t':
                    pipeline.push(key, recProps.duration);
                    break;
                case '-y':
                    pipeline.push(key, outputPath);
                    break;
                default:
                    pipeline.push(key, outputPipe[key]);
                    break;
            }
        });
    
        return pipeline;
    }

    // Start ffmpeg recording
    record(_recProps) {
        console.log('\x1b[32m%s\x1b[0m', `[FMPEGMan.js] - record() ${this.stream.name} at ${DateTime.local().toISOTime()}`);
        
        const recProps = _recProps;
        
        // set duration to no decimal
        recProps.duration = recProps.duration.toFixed(0);

        // construct pipeline
        const pipeline = this.createPipeline(recProps);

        console.log('ffmpeg', pipeline.join(' '));

        // initiate ffmpeg process
        const ffmpegProcess = 
            execFile(
                'ffmpeg',
                pipeline,
                (error, stdout, stderr) => {
                    if (error) {
                        console.log('FFMPEG ERROR - errored exit!');
                        // throw error;
                    }

                    if (stdout) {
                        console.log('FFMPEG STDOUT', stdout);
                    }
                    
                    if (stderr && !error) {
                        console.log('FFMPEG STDERR - clean exit');
                    }
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
    }

    finish() {
        // log finish time
        console.log('\x1b[36m%s\x1b[0m', `[FMPEGMan.js].finish() - Record finished at ${DateTime.local().toISOTime()}`);
    }
    
    // stop ffmpeg recording instances
    stopRecord(signal = 'SIGTERM') {
        // kill all processes
        this.processes.forEach((ffmpegProcess) => {
            kill(ffmpegProcess.pid, signal);
        });

        this.processes = [];

        console.log('[FFMPEGMan.js].stopRecord() - stoping all record instances!');
    }

    killProcesses() {
        console.log('Killing FFMPEG child processes!');
        this.processes.forEach((ffmpegProcess) => {
            kill(ffmpegProcess.pid, 'SIGINT');
        });

        this.processes = [];
    }
}

export default FFMPEG;
