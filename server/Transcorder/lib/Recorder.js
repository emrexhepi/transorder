// import process libraries
import kill from 'tree-kill';
import { execFile } from 'child_process';
import { DateTime } from 'luxon';
import * as helper from './helpers';

// import redux
import * as actionTypes from '../redux/actions/actionTypes';

import { updateRecorderFields } from '../redux/actions/transcoderActions';

import { 
    getStreamFromStore,
    getRecorderSettingsFromStore,
    getRecorderFromStore,
} from '../redux/selectors/transcoderSelectors';

class Recorder {
    store = null;
    streamID = '';
    stream = {};
    ID = '';
    skipFirstSecs = 0;
    process = null;
    pipeline = [];

    outputDirectory = null;
    outputFileName = null;
    outputPath = null;
    finished = false;
    nodeProcessHook = null;

    constructor(store, streamID, ID) {
        this.store = store;
        this.streamID = streamID;
        this.ID = ID;

        this.updateStreamAndSettings();
        
        process.on('exit', this.cleanExit);
    }

    // Start ffmpeg recording
    start(recordDuration, skipFirstSecs = 0) {
        this.skipFirstSecs = skipFirstSecs;
        console.log('\n\nNew Record ====================================');
        // console.log('skipFirstSecs:', this.skipFirstSecs);
        // console.log('[Recorder.js].record() -> Now:\t\t\t', DateTime.local().toRFC2822());
        // console.log('[Recorder.js].record() -> Record ID:\t\t', this.ID);
        // console.log('[Recorder.js].record() -> Record Duration\t', recordDuration);

        // let dateTime = DateTime.local();
        // dateTime = dateTime.plus({ seconds: recordDuration });

        // console.log('[Recorder.js].record() -> Estimated to end at:\t', dateTime.toRFC2822());
    
        // construct pipeline
        const pipeline = this.createPipeline(recordDuration, this.skipFirstSecs);
        console.log('ffmpeg', pipeline.join(' '));
        
        const path = {
            outputDirectory: this.outputDirectory,
            outputPath: this.outputPath,
            outputFileName: this.outputFileName,
        };

        console.log(path);
        
        // if base file path on store empty
        // store filepath
        // get recorder from store
        const recorderInfo = getRecorderFromStore(this.store, this.ID);
        if (!recorderInfo.basePath) {
            updateRecorderFields(
                this.store,
                this.ID,
                {
                    basePath: path,
                },
            );
        }
    
        // initiate ffmpeg process
        this.process = execFile(
            'ffmpeg',
            pipeline,
            (error, stdout, stderr) => {
                this.store.dispatch({
                    type: actionTypes.FINISHED_RECORD,
                    recorderID: this.ID,
                    streamID: this.streamID,
                    path,
                    pipeline,
                    payload: {
                        error,
                        stdout,
                        stderr,
                    },
                });
            },
        );
    }

    // get streams from 
    updateStreamAndSettings() {
        this.stream = getStreamFromStore(this.store, this.streamID);
        this.settings = getRecorderSettingsFromStore(this.store);
    }

    // return folder and file name and creates root directories
    createFolderAndFileName() {
        // get ouput path
        let { outputDirectory } = this.stream;

        const recorderInfo = getRecorderFromStore(this.store, this.ID);

        console.log(recorderInfo);

        const dateStrFolder = DateTime.local().toFormat('yyyy-MM-dd');
        const dateStrFile = DateTime.local().toFormat('yyyyMMdd');
        const timeStr = DateTime.local().plus({ seconds: this.skipFirstSecs }).toFormat('HH-mm-ss');
        // check if outputDirectory has backslash
        if (outputDirectory[outputDirectory.length - 1] !== '\\') {
            outputDirectory += '\\';
        }

        
        // add stream name to directory
        outputDirectory += `${this.stream.name}\\${dateStrFolder}\\`;
        
        // check and create folder
        helper.mkDirByPathSync(outputDirectory);

        this.outputDirectory = outputDirectory;

        // create filename and set it
        this.outputFileName = `${this.stream.name}_${dateStrFile}_${timeStr}`;

        console.log('skipFirstSecods', this.skipFirstSecs);

        this.outputPath = outputDirectory + this.outputFileName + this.settings.fileExtension;

        console.log(this.outputPath);
        
        // process.exit();
        return this.outputPath;
    }

    // creates the ffmpeg pipeline
    createPipeline(recordDuration, skipSecs) {
        const { global, inputPipe, outputPipe } = this.settings;

        const outputPath = this.createFolderAndFileName();

        this.outputPath = outputPath;
    
        const pipeline = [];

        const pushToPipeLine = (key, value) => {
            if (key === undefined || value === undefined) {
                return;
            }

            if (value === '' || value === null) {
                pipeline.push(key);
                return;
            }

            pipeline.push(key, value);
        };
        
        // add global properties to pipeline
        Object.keys(global).forEach((key) => {
            pushToPipeLine(key, global[key]);
        });
        
        // add inputPipe properties to pipeline
        Object.keys(inputPipe).forEach((key) => {
            switch (key) {
                case '-ss':
                    pushToPipeLine(key, skipSecs);
                    break;
                case '-i':
                    pushToPipeLine(key, this.stream.input);
                    break;
                default:
                    pushToPipeLine(key, inputPipe[key]);
                    break;
            }
        });
        
        // add outputPipe properties to pipeline
        Object.keys(outputPipe).forEach((key) => {
            switch (key) {
                case '-t':
                    pushToPipeLine(key, recordDuration);
                    break;
                case '-y':
                    pushToPipeLine(key, outputPath);
                    break;
                default:
                    pushToPipeLine(key, outputPipe[key]);
                    break;
            }
        });
    
        return pipeline;
    }

    isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
    
    // stop ffmpeg recording instances
    stopRecord() {
        if (this.process !== null) {
            kill(this.process.pid, 'SIGINT');
            this.process.pid = null;
        }
    }

    cleanExit() {
        // this.stopRecord();
        // process.removeListener('exit', this.cleanExit);
    }
}

export default Recorder;
