/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CONSOLE_LOG,
} from 'config/index';

const log = (...props: any[]): void => {
  if (CONSOLE_LOG) {
    console.log(...props);
  }
};

export const errorLog = (...props: any[]): void => {
  console.error(...props);
};

export default log;
