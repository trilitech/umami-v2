import { format } from "@taquito/utils";
import { BigNumber } from "bignumber.js";

import { TEZ, TEZ_DECIMALS } from "./constants";

export const truncate = (name: string, len: number) =>
  name.length > len ? name.slice(0, len - 3) + "..." : name;

export const tezToMutez = (tez: string): BigNumber => format("tz", "mutez", tez) as BigNumber;

export const mutezToTez = (mutez: BigNumber | string | number) =>
  format("mutez", "tz", mutez) as BigNumber;

export const formatTezAmount = (
  mutez: BigNumber | string | number,
  minimumFractionDigits?: number
): string => {
  const tezAmount = BigNumber(mutezToTez(mutez)).toNumber();
  // make sure we always show 6 digits after the decimal point
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minimumFractionDigits ?? TEZ_DECIMALS,
    maximumFractionDigits: TEZ_DECIMALS,
  });

  return formatter.format(tezAmount);
};

export const prettyTezAmount = (mutez: BigNumber | string | number): string => {
  const fee = formatTezAmount(mutez);
  return `${fee} ${TEZ}`;
};

export const formatTezAmountMin0Decimals = (mutez: BigNumber | string | number): string => {
  const fee = formatTezAmount(mutez, 0);
  return `${fee} ${TEZ}`;
};

export const formatUsdAmount = (usd: BigNumber | string | number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(BigNumber(usd).toNumber());
};

// Generates displayed account address string from public key hash
export const formatPkh = (pkh: string) => `${pkh.slice(0, 5)}...${pkh.slice(-5)}`;
