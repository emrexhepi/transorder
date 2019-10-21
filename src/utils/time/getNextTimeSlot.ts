/**
 * Utils
 */
import getCurrentTimeSlot from 'utils/time/getCurrentTimeSlot';

const getNextTimeSlot = (seconds: number, skipSeconds = 0): number => (
  seconds + getCurrentTimeSlot(seconds, skipSeconds)
);

export default getNextTimeSlot;
