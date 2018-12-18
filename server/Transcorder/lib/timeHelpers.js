import { DateTime } from 'luxon';

// //////////////////////////////////////////////////////
// CONSTANTS

// export constants
export const DAY_IN_SECONDS = 86400;

// END CONSTANTS
// #####################################################
// /////////////////////////////////////////////////////


// //////////////////////////////////////////////////////
// CONVERTERS

// return current time of day in seconds;
export const convertDateTimeToSeconds = (dateTime) => {
    // calculate time in seconds
    const timeInSeconds =
        (dateTime.hour * 60 * 60) +
        (dateTime.minute * 60) +
        dateTime.second +
        (dateTime.millisecond / 1000);
    
    // console.log('milliseconds', dateTime.millisecond);

    // return time in seconds
    return timeInSeconds;
};

// converts seconds to datetime
export const convertSecondsToDateTime = (seconds) => {
    // today date string
    const dateStr = `${DateTime.local().year}-${DateTime.local().month}-${DateTime.local().day}`;
    
    // create DateTime from format
    let dateTime = DateTime.fromFormat(dateStr, 'yyyy-M-d');

    // add the seconds
    dateTime = dateTime.set({
        seconds,
    });

    return dateTime;
};

export const secondsToMilliseconds = seconds => seconds * 1000;

// END CONVERTERS
// ///////////////////////////////////////////////////////
// #######################################################


// //////////////////////////////////////////////////////
// GETTERS

// return local datetime
export const currentDayTime = () => DateTime.local();

// return DateTime time-slot
export const currentTimeSlotInSec = (durationInSeconds, addToDateTimeSecs = 0) => {
    const timeInSeconds = convertDateTimeToSeconds(DateTime.local()) + addToDateTimeSecs;

    if (DAY_IN_SECONDS % durationInSeconds !== 0) {
        throw new Error('Duration does not add to a full day! pls. add a duration that remainder to a minute in seconds is 0');
    }

    return timeInSeconds - (timeInSeconds % durationInSeconds);
};

// return next time-slot
export const nextTimeSlotInSec = (durationInSeconds, addToDateTimeSecs = 0) => {
    // get current time slot
    const currentTimeSlot = currentTimeSlotInSec(durationInSeconds, addToDateTimeSecs);

    // calculate nextTimeSlot
    const nextTimeSlot = currentTimeSlot + durationInSeconds;
    // console.log('nextTimeSlot: ', nextTimeSlot);
    return nextTimeSlot;
};

// return difference to next time slot
export const diffToNextTimeSlotInSec = (durationInSeconds, addToDateTimeSecs = 0) => {
    // get next time slot
    const nextTimeSlot = nextTimeSlotInSec(durationInSeconds, addToDateTimeSecs);

    // calculate today time in seconds
    const todayTime = convertDateTimeToSeconds(DateTime.local());
    // calculate difference to next time slot
    const diff = nextTimeSlot - todayTime;

    return diff;
};

// END GETTERDS
// ///////////////////////////////////////////////////////
// #######################################################


// Default return current DateTime
const dateTimeNow = () => DateTime.local();

export default dateTimeNow;
