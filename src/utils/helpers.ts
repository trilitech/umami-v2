import { BigNumber } from "bignumber.js";

export function filterNulls<T>(arr: Array<T | null | undefined>): T[] {
  return arr.filter((v) => v != null) as T[];
}

export function objectMap<T, R>(obj: Record<string, T>, fn: (v: T) => R) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

export function zip<A, B>(a: A[], b: B[]) {
  return a.map((k, i) => [k, b[i]] as [A, B]);
}

export function validateNonNegativeNumber(num: string): string | null {
  const val = new BigNumber(num);
  if (val.isLessThan(0)) {
    return null;
  }
  return val.toString();
}
