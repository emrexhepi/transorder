import IStream from 'interfaces/IStream';

declare module '*config.json' {
  export const ffmpegCommand: string;
  export const minimumRecordTime: number;
  export const consoleLog: boolean;
  export const recExtension: string;
  export const recDirectory: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}

declare module '*streams.json' {
  export const streams: IStream[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}
