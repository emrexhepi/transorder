import compile from 'string-template/compile';

/**
 * Interfaces
 */
import Record from 'interfaces/Record';

/**
 * Config
 */
import FFMPEG_COMMAND from 'config/FFMPEG_COMMAND';

/**
 * helpers
 */
const commandTemplate = compile(FFMPEG_COMMAND);

const scheudler = (): void => {
  const ffmpegCommand = commandTemplate({
    b: 'test3',
  });

  const record: Record = {
    command: ffmpegCommand,
    id: 'test_id',
  };

  console.log(record);
};

export default scheudler;
