// allows to kill a promise if it takes more than the specified timeout
export const withTimeout = <T>(fn: () => Promise<T>, timeout: number, errorMessage?: string) =>
  Promise.race([
    fn(),
    // it's safe to use the same type parameter T here
    // because we're going to throw anyway which stops the execution
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        reject(new Error(errorMessage || "The operation has timed out"));
      }, timeout)
    ),
  ]);
