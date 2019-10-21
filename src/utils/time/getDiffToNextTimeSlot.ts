/**
 * Utils
 */
import getNextTimeSlot from 'utils/time/getNextTimeSlot';
import getTimeInSeconds from 'utils/time/getTimeInSeconds';

const getDiffToNextTimeSlot = (seconds: number, skipSeconds = 0): number => {
  const nextTimeSlot = getNextTimeSlot(seconds, skipSeconds);
  const timeNow = getTimeInSeconds();

  return nextTimeSlot - timeNow;
};

export default getDiffToNextTimeSlot;
