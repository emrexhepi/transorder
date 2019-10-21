import { DateTime } from 'luxon';
import compile from 'string-template/compile';
import recorder from 'libs/recorder';
// import ffprobe from 'libs/ffprobe';

/**
 * Config import
 */
import {
  REC_DIRECTORY,
  REC_EXITENSION,
  FFMPEG_COMMAND,
} from 'config/index';

/**
 * Utils Import
 */
import convertSecondsToDateTime from 'utils/time/convertSecondsToDateTime';
import log, { errorLog } from 'utils/log';
// import getCurrentTimeSlot from 'utils/time/getCurrentTimeSlot';

/**
 * Interfaces import
 */
import IStream from 'interfaces/IStream';
import IRecord from 'interfaces/IRecord';
import IFFMPEGParams from 'interfaces/IFFMPEGParams';
import ITimeslot from 'interfaces/ITimeslot';

/**
 * helpers
 */
const commandTemplate = compile(FFMPEG_COMMAND);

const recordingTask = async (
  stream: IStream,
  timeslot: ITimeslot,
  firstTime = false,
): Promise<void> => {
  // constants
  let {
    duration,
    skipSeconds,
  } = stream;
  // const currentTimeSlot = getCurrentTimeSlot(duration);
  const currentTimeSlot = timeslot.current;

  // generate folder name
  const recDirectory = stream.dir || REC_DIRECTORY;
  const dateNow = DateTime.local().toFormat('ddMMyyyy');
  const timeSlotDateTime = convertSecondsToDateTime(currentTimeSlot);
  const folderName = `${recDirectory}/${dateNow}/${stream.id}/`;

  // generate file name
  const timeSlotString = timeSlotDateTime.toFormat('HHmmss');
  let fileName = `${stream.id}-${dateNow}-${timeSlotString}`;

  if (firstTime) {
    duration = timeslot.diffToNext;
    skipSeconds = 0;
    fileName = `${fileName}_${DateTime.local().toFormat('HHmmss')}`;
    console.log('firstime duration:', duration);
  }

  /**
   * Record loop
   */
  // compile command template
  const outputPath = `${folderName}${fileName}${REC_EXITENSION}`;
  const iffmpegParams: IFFMPEGParams = {
    inputPath: stream.link,
    outputPath,
    time: duration,
    skip: skipSeconds,
  };
  const ffmpegCommand = commandTemplate(iffmpegParams);

  console.log(ffmpegCommand);

  // record instance
  const record: IRecord = {
    dir: folderName,
    command: ffmpegCommand,
  };

  try {
    await recorder(record);
    log('Record finished!');
    // log(result);
  } catch (e) {
    errorLog(e);
  }
  // const failed = false;
  // const result = {};
  // try {
  //   const result = await ffprobe(outputPath);
  // } catch (e) {
  //   errorLog(e);
  // }

  // // eslint-disable-next-line eqeqeq
  // if (!result || Object.keys(result) === 0) {
  //   console.log('gailed');
  // }
};

export default recordingTask;
