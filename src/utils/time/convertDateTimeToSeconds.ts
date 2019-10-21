const convertDateTimeToSeconds = (dateTime: any): number => {
  // calculate time in seconds
  const timeInSeconds = (dateTime.hour * 60 * 60)
        + (dateTime.minute * 60)
        + dateTime.second
        + (dateTime.millisecond / 1000);

  // return time in seconds
  return timeInSeconds;
};

export default convertDateTimeToSeconds;
