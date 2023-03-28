import BigNumber from "bignumber.js";

export const getTotalBalance = (balances: Record<string, BigNumber | null>) => {
  const totalTez = Object.values(balances).reduce((acc, curr) => {
    if (acc === null) {
      return curr;
    } else {
      return curr === null ? acc : BigNumber.sum(curr, acc);
    }
  }, null);

  return totalTez;
};
