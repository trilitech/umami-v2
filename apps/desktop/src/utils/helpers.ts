import { BigNumber } from "bignumber.js";

export function validateNonNegativeNumber(num: string): string | null {
  const val = new BigNumber(num);
  if (val.isLessThan(0)) {
    return null;
  }
  return val.toFixed();
}
