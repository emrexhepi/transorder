export default interface IRecorderResult {
  success: boolean;
  message: string;
  error?: Error;
  stdout?: string;
  stderr?: string;
}
