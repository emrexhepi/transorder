import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadJson = (filePath: string): any => (
  JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'))
);

export default loadJson;
