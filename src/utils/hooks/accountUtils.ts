import BigNumber from "bignumber.js";
import { balance } from "../store/assetsSlice";

export const getTotalBalance = (balances: Record<string, balance>) => {
  const totalTez = Object.values(balances)
    .map((b) => b.tez)
    .reduce((acc, curr) => {
      if (acc === null) {
        return curr;
      } else {
        return curr === null ? acc : BigNumber.sum(curr, acc);
      }
    }, null);

  return totalTez;
};
