import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";

export const formatPkh = (pkh: string) => {
  return `${pkh.slice(0, 5)}...${pkh.slice(-5, pkh.length)}`;
};

export const truncate = (name: string, len: number) => {
  return name.length > len ? name.slice(0, len) + "..." : name;
};

export const tezToMutez = (tez: string): BigNumber =>
  format("tz", "mutez", tez) as BigNumber;

<<<<<<< HEAD
export const mutezToTez = (m: BigNumber) => format("mutez", "tz", m) as string;
=======
export const mutezToTez = (m: BigNumber) =>
  format("mutez", "tz", m) as BigNumber;
>>>>>>> 0a93ac9 (Use mutez instead of tez)

export const prettyTezAmount = (a: BigNumber, isTez = false) =>
  `${String(isTez ? a : format("mutez", "tz", a))} ꜩ`;
