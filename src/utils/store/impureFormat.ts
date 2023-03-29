import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";

export const mutezToTez = (m: BigNumber) =>
  (format("mutez", "tz", m) as BigNumber).toNumber();

export const mutezToTezNumber = (m: number) =>
  (format("mutez", "tz", m) as BigNumber).toNumber();

export const prettyTezAmount = (a: number, isTez: boolean = false) =>
  `${String(isTez ? a : format("mutez", "tz", a))} ꜩ`;
