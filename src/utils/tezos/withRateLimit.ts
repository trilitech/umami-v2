import Semaphore from "@chriscdn/promise-semaphore";
import promiseRetry from "promise-retry";

const tzktRateLimiter = new Semaphore(10);

export const withRateLimit = <T>(fn: () => Promise<T>) =>
  tzktRateLimiter
    .acquire()
    .then(() => promiseRetry(retry => fn().catch(retry), { retries: 3, minTimeout: 100 }))
    .catch((error: any) => {
      // tzkt throws HttpError, but doesn't export it
      // default behaviour just shows Error: 504 which isn't very helpful for the user
      if ("status" in error && "data" in error) {
        throw new Error(`Fetching data from tzkt failed with: ${error.status}, ${error.data}`);
      }
      throw error;
    })
    .finally(() => tzktRateLimiter.release());
