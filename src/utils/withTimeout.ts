// allows to kill a promise if it takes more than the specified timeout
export const withTimeout = <T>(fn: () => Promise<T>, timeout: number, errorMessage?: string) =>
  Promise.race([
    fn(),
    new Promise((_, reject) =>
      setTimeout(() => {
        reject(new Error(errorMessage || "The operation has timed out"));
      }, timeout)
    ),
  ]);
