import { DateTime } from 'luxon';

// converts seconds to datetime
const convertSecondsToDateTime = (seconds: number): DateTime => {
  // today date string
  const dateStr = `${DateTime.local().year}-${DateTime.local().month}-${DateTime.local().day}`;

  // create DateTime from format
  let dateTime = DateTime.fromFormat(dateStr, 'yyyy-M-d');

  // add the seconds
  dateTime = dateTime.set({
    second: seconds,
  });

  return dateTime;
};

export default convertSecondsToDateTime;
