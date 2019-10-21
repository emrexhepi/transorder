/**
 * Import Libs
 */
import { execFile } from 'child_process';

/**
 * import utils
 */
// import mkdirFromPathSync from 'utils/mkdirFromPathSync';

/**
 * Import Interfaces
 */

// eslint-disable-next-line @typescript-eslint/ban-types
const FFProbe = async (path: string): Promise<Object> => {
  // build FFProbe promise
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promise = new Promise<any>((resolve, reject): void => {
    // check if folder is accesable
    // and create path

    // make command as array
    const command = `ffprobe -v quiet -print_format json -show_format ${path}`;
    console.log(command);
    const pipeline = command.split(' ');

    execFile(
      pipeline[0],
      pipeline.slice(1, pipeline.length),
      (error, stdout, stderr) => {
        console.log('error', error);
        console.log('stdout', stdout);
        console.log('stderr', stderr);
        if (error) {
          reject(error);
        }
        resolve(JSON.stringify(stderr));
      },
    );
  });

  return promise;
};

export default FFProbe;
