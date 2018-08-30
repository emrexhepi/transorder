import { DateTime } from 'luxon';

// //////////////////////////////////////////////////////
// CONSTANTS

// export constants
export const DAY_IN_SECONDS = 86400;


// //////////////////////////////////////////////////////
// CONVERTERS


// return current time of day in seconds;
export const convertDateTimeToSeconds = (dateTime) => {
    // calculate time in seconds
    const timeInSeconds =
        (dateTime.hour * 60 * 60) +
        (dateTime.minute * 60) +
        dateTime.second;

    // return time in seconds
    return timeInSeconds;
};


// converts seconds to datetime
export const convertTodaySecondsToDateTime = (seconds) => {
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

// //////////////////////////////////////////////////////
// GETTERS

// return DateTime time-slot
export const currentDateTimeSlot = (durationInSeconds) => {
    const timeInSeconds = convertDateTimeToSeconds(DateTime.local());

    if (DAY_IN_SECONDS % durationInSeconds !== 0) {
        throw new Error('Duration does not add to a full day! pls. add a duration that multiplays a minute in seconds');
    }

    return timeInSeconds - (timeInSeconds % durationInSeconds);
};

// return next time-slot
export const nextDateTimeSlot = (durationInSeconds) => {
    // get current time slot
    const currentTimeSlot = currentDateTimeSlot(durationInSeconds);

    // calculate nextTimeSlot
    const nextTimeSlot = currentTimeSlot + durationInSeconds;

    return nextTimeSlot;
};

// return difference to next time slot
export const diffToNextTimeSlot = durationInSeconds => 
    nextDateTimeSlot(durationInSeconds) - convertDateTimeToSeconds(DateTime.local());


// Default return current DateTime
const dateTimeNow = () => DateTime.local();

export default dateTimeNow;
