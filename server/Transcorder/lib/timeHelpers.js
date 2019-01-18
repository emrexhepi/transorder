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

// return current time slot in seconds
export const currentTimeSlotInSec = (durationInSeconds, skipFirstSecs = 0) => {
    const timeInSeconds = convertDateTimeToSeconds(DateTime.local());

    if (DAY_IN_SECONDS % durationInSeconds !== 0) {
        throw new Error('Duration does not add to a full day! pls. add a duration that remainder to a minute in seconds is 0');
    }

    return timeInSeconds - (timeInSeconds % durationInSeconds);
};

// current Time Slot
export const currentTimeSlot = (durationInSeconds, skipFirstSecs = 0) => {
    const currentTimeSlotSecs = currentTimeSlotInSec(durationInSeconds, skipFirstSecs);
    return convertSecondsToDateTime(currentTimeSlotSecs);
};

// Next Time Slot
export const nextTimeSlot = (recDuration = 60, currentTS = null) => {
    if (!currentTS) {
        return currentTimeSlot(recDuration).plus({
            seconds: recDuration,
        });
    } 

    return currentTS.plus({
        seconds: recDuration,
    });
};

// returns difference to next time slot as DURATION
export const schedToNextTimeSlot = (recDuration = 60, fromTimeSlot = null) => {
    // DateTime
    const currentTS = fromTimeSlot || currentTimeSlot(recDuration);
    // DateTime
    const nextTS = nextTimeSlot(recDuration, currentTS);
    // Duration
    const diffToNextTS = nextTS.diffNow();
    // Seconds
    const diffToNextTSSec = diffToNextTS.values.milliseconds / 1000;

    return {
        recDuration,
        currentTS,
        nextTS,
        diffToNextTS,
        diffToNextTSSec,
    };
};


// END GETTERDS
// ///////////////////////////////////////////////////////
// #######################################################


// Default return current DateTime
const dateTimeNow = () => DateTime.local();

export default dateTimeNow;
