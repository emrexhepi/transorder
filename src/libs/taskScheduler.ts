/**
 * Config
 */
import {
  MINIMUM_RECORD_TIME,
} from 'config/index';

/**
 * Types import
 */
import IStream from 'interfaces/IStream';
import ITimeslot from 'interfaces/ITimeslot';

/**
 * Tasks import
 */
import recordingTask from 'tasks/recordingTask';

/**
 * Utils
 */
import getCurrentTimeSlot from 'utils/time/getCurrentTimeSlot';
import getNextTimeSlot from 'utils/time/getNextTimeSlot';
import getDiffToNextTimeSlot from 'utils/time/getDiffToNextTimeSlot';
import timeInSeconds from 'utils/time/getTimeInSeconds';
import printTime from 'utils/time/printTime';
import delay from 'utils/delay';
import log from 'utils/log';

const taskScheduler = async (stream: IStream, firstTime = true): Promise<void> => {
  /**
   * Stream settings check
   */
  if ((stream.duration - stream.skipSeconds) < MINIMUM_RECORD_TIME) {
    throw new Error(`Error: Stream duration + skipSeconds in ${stream.id} are smaller then minimum allowed record time!`);
  }

  /**
   * Constants
   */
  const {
    skipSeconds,
  } = stream;
  let currentTimeSlot = getCurrentTimeSlot(stream.duration, skipSeconds);
  let nextTimeSlot = getNextTimeSlot(stream.duration, skipSeconds);
  let diffToNextTimeSlot = getDiffToNextTimeSlot(stream.duration, skipSeconds);

  /**
   * If there are skip seconds
   * If difference to next time slot
   * is smaller then 0
   * skip timeslot
   * recalculate
  */
  if (diffToNextTimeSlot < 0) {
    currentTimeSlot += stream.duration;
    nextTimeSlot += stream.duration;
    diffToNextTimeSlot = Math.round(nextTimeSlot - timeInSeconds());
  }

  log('Time Now: ', timeInSeconds());
  printTime(timeInSeconds());
  log('Current Time Slot: ');
  printTime(currentTimeSlot);
  log('Next Time Slot: ');
  printTime(nextTimeSlot);
  log('Difference to Time Slot: ');
  printTime(diffToNextTimeSlot);
  log(diffToNextTimeSlot);

  const timeslot: ITimeslot = {
    current: currentTimeSlot + stream.skipSeconds,
    next: nextTimeSlot,
    diffToNext: diffToNextTimeSlot,
  };

  /**
   * Schedule task imediately
   * if difference to next timeslot is greater then
   * MINIMUM_RECORD_TIME + skiptime && not first time
   */
  if (diffToNextTimeSlot > (MINIMUM_RECORD_TIME + skipSeconds) && firstTime) {
    recordingTask(stream, timeslot, true);
  }

  /**
   * If not the first time of iteration
   * just call the task
   */
  if (!firstTime) {
    recordingTask(stream, timeslot);
  }

  /**
   * Delay the next task scheduler
   * for the difference to nextimeslot
   * minus the skiped seconds
   */
  await delay(diffToNextTimeSlot);
  taskScheduler(stream, false);
};

export default taskScheduler;
