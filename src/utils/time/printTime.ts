/**
 * Utils
 */
import convertSecondsToDateTime from 'utils/time/convertSecondsToDateTime';
import log from 'utils/log';

const printTime = (seconds: number): void => {
  const dateTime = convertSecondsToDateTime(seconds);
  log(dateTime.toISOTime());
};

export default printTime;
