import taskScheduler from 'libs/taskScheduler';

/**
 * Import streams
 */
import { streams } from 'streams.json';

streams.forEach((stream) => {
  taskScheduler(stream);
});

/**
 * Create Streams
 */
// const stream: IStream = {
//   id: 'temp',
//   link: 'http://192.168.30.8:7800/temp/index.m3u8',
//   duration: 60,
//   skipSeconds: 10,
// };

// // start a schedule
// taskScheduler(stream);
