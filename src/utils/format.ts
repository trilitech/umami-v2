import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";
export * from "./formatPkh";

export const truncate = (name: string, len: number) => {
  return name.length > len ? name.slice(0, len - 3) + "..." : name;
};

export const tezToMutez = (tez: string): BigNumber => format("tz", "mutez", tez) as BigNumber;

export const mutezToTez = (m: BigNumber | string) => format("mutez", "tz", m) as string;

export const prettyTezAmount = (a: BigNumber | string, isTez = false) =>
  `${String(isTez ? a : format("mutez", "tz", a))} ꜩ`;
