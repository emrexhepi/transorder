import {
  DAY_IN_SECONDS,
} from 'config/index';

/**
 * Utils
 */
import getTimeInSeconds from 'utils/time/getTimeInSeconds';

const currentTimeSlot = (seconds: number, skipSeconds = 0): number => {
  const timeInSeconds = getTimeInSeconds(skipSeconds);

  if (DAY_IN_SECONDS % seconds !== 0) {
    throw new Error('Duration does not add to a full day! pls. add a duration that remainder to a minute in seconds is 0');
  }

  return timeInSeconds - (timeInSeconds % seconds) - skipSeconds;
};

export default currentTimeSlot;
