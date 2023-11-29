import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";
import { TEZ } from "./tezos";

export const truncate = (name: string, len: number) => {
  return name.length > len ? name.slice(0, len - 3) + "..." : name;
};

export const tezToMutez = (tez: string): BigNumber => format("tz", "mutez", tez) as BigNumber;

export const mutezToTez = (mutez: BigNumber | string) => format("mutez", "tz", mutez) as string;

export const prettyTezAmount = (mutez: BigNumber | string): string => {
  const tezAmount = BigNumber(mutezToTez(mutez)).toNumber();
  // make sure we always show 6 digits after the decimal point
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
  return `${formatter.format(tezAmount)} ${TEZ}`;
};

// Generates displayed account address string from public key hash
export const formatPkh = (pkh: string) => `${pkh.slice(0, 5)}...${pkh.slice(-5)}`;
