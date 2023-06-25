import { chunk } from "lodash";

// limits the concurrency level
// helpful to keep the simultaneous requests amount under control
// each chunk will first wait until the previous one is done
export const processInBatches = async <T, U>(
  collection: T[],
  chunkSize: number,
  transformFn: (elem: T) => Promise<U>
): Promise<U[]> => {
  const chunks = chunk(collection, chunkSize);
  let result: U[] = [];
  for (const chunk of chunks) {
    result = result.concat(await Promise.all(chunk.map(transformFn)));
  }
  return result;
};
