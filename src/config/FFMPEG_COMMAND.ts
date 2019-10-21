/**
 * {inputPath} for stream link
 * {outputPath} for record path
 * {time} for rcord time
 * {skip} for skiping secconds
 */

const command = 'ffmpeg -loglevel fatal -y -i {inputPath} -ss {skip} -t {time} -c:v libx264 {outputPath}';

export default command;
