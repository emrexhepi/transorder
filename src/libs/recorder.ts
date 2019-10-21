/**
 * Import Libs
 */
import { execFile } from 'child_process';
import { ensureDirSync } from 'fs-extra';

/**
 * import utils
 */
// import mkdirFromPathSync from 'utils/mkdirFromPathSync';

/**
 * Import Interfaces
 */
import IRecord from 'interfaces/IRecord';
import IRecordResult from 'interfaces/IRecorderResult';

const Recorder = async (record: IRecord): Promise<IRecordResult> => {
  // build recorder promise
  const promise = new Promise<IRecordResult>((resolve, reject): void => {
    // check if folder is accesable
    // and create path
    try {
      ensureDirSync(record.dir);
    } catch (e) {
      const recordResult: IRecordResult = {
        success: false,
        message: e.message,
        error: e,
      };

      reject(recordResult);

      return;
    }

    // make command as array
    const pipeline = record.command.split(' ');

    execFile(
      pipeline[0],
      pipeline.slice(1, pipeline.length),
      (error, stdout, stderr) => {
        // if error
        if (error) {
          const recordResult: IRecordResult = {
            success: false,
            message: error.message,
            error,
            stdout,
            stderr,
          };

          reject(recordResult);
          // terminate function
          return;
        }

        // if success
        const recordResult: IRecordResult = {
          success: true,
          message: 'Recorded executed Successfully!',
          error,
          stdout,
          stderr,
        };

        resolve(recordResult);
      },
    );
  });

  return promise;
};

export default Recorder;
