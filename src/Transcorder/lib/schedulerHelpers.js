
function checkSettings(schedSettings, stream) {
    // check skipSecs if greater then record time
    if (
        schedSettings.skipFirstSecs >
        (stream.recDuration + schedSettings.beforeTimeSlotSecs)
    ) {
        throw Error('Scheduler settings skipFirstSecs is greater then stream record duration plus beforeTimeSlotSecs!');
    }

    // check stream record duration should be greater then min duration
    if (stream.recDuration < schedSettings.minDuration) {
        throw Error(`Stream record duration should be greater then ${schedSettings.minDuration} seconds!`);
    }
}
exports.checkSettings = checkSettings;
