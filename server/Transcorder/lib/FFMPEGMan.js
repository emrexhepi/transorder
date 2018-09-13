// import process libraries
import kill from 'tree-kill';

import { execFile } from 'child_process';

import { DateTime } from 'luxon';

import * as helper from './helpers';

class FFMPEG {
    processes = [];
    pipeline = [];
    onSuccessHooks = [];
    onErrorHooks = [];
    outputDirectory = null;
    outputFileName = null;
    outputPath = null;
    fileExtension = '.mp4';
    finished = false;

    constructor(ID, stream, settings) {
        this.ID = ID;
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

        this.outputDirectory = outputDirectory;

        // create filename
        const filename = `${dateStr}_${timeStr}`;

        this.outputFileName = filename;

        this.outputPath = outputDirectory + filename + this.fileExtension;

        return this.outputPath;
    }

    createPipeline(recProps) {
        const { global, inputPipe, outputPipe } = this.settings;

        const outputPath = this.createFolderAndFileName(recProps);

        this.outputPath = outputPath;
    
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
        console.log('\x1b[32m%s\x1b[0m', `[FMPEGMan.js].record() ${this.stream.name} at ${DateTime.local().toISOTime()}`);
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
                    if (this.finished) {
                        return;
                    }

                    if (error || stderr) {
                        console.log('FFMPEG STDERR - errored exit');
                        this.dispatch(this.onErrorHooks, [this, error]);
                    }
                    
                    if (!stderr && !error) {
                        console.log('FFMPEG STDERR - clean exit');
                        this.dispatch(this.onSuccessHooks, [this]);
                    }
                },
            );

        this.processes.push(ffmpegProcess);
    }

    isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    onError(func) {
        // check if function
        if (!this.isFunction) {
            throw new Error('Please insert function!');
        }

        // kill instances
        this.killProcesses();

        // this function should be overrided
        this.onErrorHooks.push(func);
    }

    onSuccess(func) {
        // check if function
        if (!this.isFunction) {
            throw new Error('Please add function as a parametter!');
        }

        // this function should be overrided
        this.onSuccessHooks.push(func);
    }

    dispatch(hooks, props) {
        // dispatch each hook
        hooks.forEach((hook) => {
            hook(...props);
        });
    }

    resetHooks() {
        this.onSuccessHooks = [];
        this.onErrorHooks = [];
    }
    
    // stop ffmpeg recording instances
    stopRecord(finished = false) {
        if (finished) {
            this.finished = true;
        }

        // kill all processes
        this.killProcesses();

        this.processes = [];

        console.log('[FFMPEGMan.js].stopRecord() - stoping all record instances!');
    }

    killProcesses(signal = 'SIGINT') {
        console.log('Killing FFMPEG child processes!');
        this.processes.forEach((ffmpegProcess) => {
            kill(ffmpegProcess.pid, signal);
        });

        this.processes = [];
    }
}

export default FFMPEG;
