import { BigNumber } from "bignumber.js";

export function objectMap<T, R>(obj: Record<string, T>, fn: (v: T) => R) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}

export function validateNonNegativeNumber(num: string): string | null {
  const val = new BigNumber(num);
  if (val.isLessThan(0)) {
    return null;
  }
  return val.toFixed();
}

export const navigateToExternalLink = (link: string) => {
  window.open(link, "_blank");
};
