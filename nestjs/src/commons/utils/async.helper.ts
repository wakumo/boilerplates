/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Delay execution of a function by specified milliseconds
 */
export function delay<T>(fn: () => T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(fn()), ms));
}

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Function to retry
 * @param maxAttempts - Maximum number of attempts (default: 3)
 * @param delayInSeconds - Delay between retries in seconds (default: 1)
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayInSeconds = 1,
): Promise<T> {
  const execute = async (attempt: number): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (attempt <= maxAttempts) {
        const nextAttempt = attempt + 1;
        console.error(`Retrying after ${delayInSeconds} seconds due to:`, err);
        return await delay(() => execute(nextAttempt), delayInSeconds * 1000);
      } else {
        throw err;
      }
    }
  };
  return execute(1);
}
