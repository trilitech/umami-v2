import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";

export const mutezToTez = (m: BigNumber) =>
  (format("mutez", "tz", m) as BigNumber).toNumber();

export const prettyTezAmount = (a: number) =>
  `${String(format("mutez", "tz", a))} ꜩ`;
