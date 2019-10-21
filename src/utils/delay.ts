/**
 * This is a promies
 * that resolves after the preset
 * amount of time
 */
const delay = (seconds: number): Promise<void> => (
  new Promise((resolve): void => {
    setTimeout(resolve, seconds * 1000);
  })
);

export default delay;
