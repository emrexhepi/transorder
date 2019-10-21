import { DateTime } from 'luxon';

/**
 * Utils
 */
import convertDateTimeToSeconds from 'utils/time/convertDateTimeToSeconds';

const getTimeInSeconds = (skipSeconds = 0): number => (
  convertDateTimeToSeconds(DateTime.local()) + skipSeconds
);

export default getTimeInSeconds;
