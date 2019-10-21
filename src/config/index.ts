/**
 * Import config
 */
import {
  ffmpegCommand,
  minimumRecordTime,
  consoleLog,
  recExtension,
  recDirectory,
} from 'config.json';


/**
 * Constants
 */
export const DAY_IN_SECONDS = 86400;

// Recording directory
// make sure u don't leave trailing '/'
export const REC_EXITENSION = recExtension;
export const REC_DIRECTORY = recDirectory;

// minimum record time in seconds
export const MINIMUM_RECORD_TIME = minimumRecordTime;

// loggign
export const CONSOLE_LOG = consoleLog;

/**
 * {inputPath} for stream link
 * {outputPath} for record path
 * {time} for rcord time
 * {skip} for skiping secconds
 */
export const FFMPEG_COMMAND = ffmpegCommand;
