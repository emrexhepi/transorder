import taskScheduler from 'libs/taskScheduler';
import loadJson from 'utils/loadJson';

/**
 * Load streams from json file
 */
const { streams } = loadJson('streams.json');

/**
 * Spin a task scheduler
 * for each stream
 */
streams.forEach((stream) => {
  taskScheduler(stream);
});
