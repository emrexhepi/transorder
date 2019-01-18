// import process libraries
import kill from 'tree-kill';
import { execFile } from 'child_process';
import { DateTime } from 'luxon';
import * as helper from './helpers';

// import redux selectors
import { 
    getStreamFromStore,
    getRecorderSettingsFromStore,
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

    constructor(store, streamID, ID) {
        this.store = store;
        this.streamID = streamID;
        this.ID = ID;

        this.updateStreamAndSettings();
    }

    // Start ffmpeg recording
    start(recordDuration, skipFirstSecs = 0) {
        this.skipFirstSecs = skipFirstSecs;
        console.log('\n\nNew Record ====================================');
        console.log('skipFirstSecs:', this.skipFirstSecs);
        console.log('[Recorder.js].record() -> Now:\t\t\t', DateTime.local().toRFC2822());
        console.log('[Recorder.js].record() -> Record ID:\t\t', this.ID);
        console.log('[Recorder.js].record() -> Record Duration\t', recordDuration);
        let dateTime = DateTime.local();
        dateTime = dateTime.plus({ seconds: recordDuration });
        console.log('[Recorder.js].record() -> Estimated to end at:\t', dateTime.toRFC2822());
    
        // construct pipeline
        const pipeline = this.createPipeline(recordDuration, this.skipFirstSecs);
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
                    }
                    
                    if (!stderr && !error) {
                        console.log('FFMPEG STDERR - clean exit');
                        // this.dispatch(this.onSuccessHooks, [this]);
                    }
    
                    console.log(stderr);
                    console.log(error);
                    console.log(stdout);
                },
            );
            
        ffmpegProcess.on('exit', (code) => {
            console.log(`\x1b[31mFFMPEG Exited with code ${code}!\x1b[0m`);
        });
    
        this.process = ffmpegProcess;
    
        process.on('exit', this.onExitHandler);
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
        const dateStrFolder = DateTime.local().toFormat('yyyy-MM-dd');
        const dateStrFile = DateTime.local().toFormat('yyyyMMdd');
        const timeStr = DateTime.local().toFormat('HH-mm-ss');
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

        this.outputPath = outputDirectory + this.outputFileName + this.settings.fileExtension;

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
        // kill(this.process.pid, 'SIGINT');
    }

    onExitHandler() {
        // this.stopRecord();
    }
}

export default Recorder;
