import taskScheduler from 'libs/taskScheduler';

/**
 * Import Interfaces
 */
import IStream from 'interfaces/IStream';

/**
 * Create Streams
 */
const stream: IStream = {
  id: 'temp',
  link: 'http://192.168.30.8:7800/temp/index.m3u8',
  duration: 60,
  skipSeconds: 10,
};

// start a schedule
taskScheduler(stream);
